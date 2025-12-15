// ODPT API에서 역별 시간표 수집
const axios = require('axios');
const db = require('../config/database');
require('dotenv').config();

const ODPT_API_KEY = process.env.ODPT_API_KEY;
const BASE_URL = 'https://api.odpt.org/api/v4';
const DELAY_MS = 1500; // API 호출 간격 (rate limit 방지)

// ODPT calendarType → DB calendarType 매핑
const calendarTypeMap = {
  'odpt.Calendar:Weekday': 'weekday',
  'odpt.Calendar:SaturdayHoliday': 'holiday',
  'odpt.Calendar:Holiday': 'holiday'
};

// 지연 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 역 시간표 수집
async function fetchStationTimetable(stationCode, odptId, railway) {
  try {
    const response = await axios.get(`${BASE_URL}/odpt:StationTimetable`, {
      params: {
        'acl:consumerKey': ODPT_API_KEY,
        'odpt:railway': railway,
        'odpt:station': odptId
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return []; // 데이터 없음
    }
    throw error;
  }
}

// 열차 타입 추출 (odpt.TrainType:TokyoMetro.Local → 普通)
function extractTrainType(trainTypeUrl) {
  if (!trainTypeUrl) return null;

  const typeMap = {
    'Local': '普通',
    'Express': '快速',
    'RapidExpress': '急行'
  };

  const match = trainTypeUrl.match(/TrainType:[^.]+\.(.+)$/);
  if (match) {
    const type = match[1];
    return typeMap[type] || type;
  }
  return null;
}

// ODPT Station ID를 stationCode로 변환하는 함수
async function convertOdptIdToStationCode(odptStationId) {
  if (!odptStationId) return null;

  // 배열인 경우 첫 번째 요소 사용
  const stationId = Array.isArray(odptStationId) ? odptStationId[0] : odptStationId;
  if (!stationId || typeof stationId !== 'string') return null;

  try {
    const result = await db.query(
      'SELECT stationCode FROM stationByLineInfo WHERE odptId = ?',
      [stationId]
    );

    if (result.length > 0) {
      return result[0].stationCode;
    }

    // 못 찾으면 영어 이름 그대로 반환 (외부 노선 역)
    return stationId.split('.').pop();
  } catch (error) {
    console.error('  ⚠️  stationCode 변환 실패:', error.message);
    return stationId.split('.').pop();
  }
}

// 열차 코드 추출 (odpt.Train:TokyoMetro.Marunouchi.A1001 → A1001)
function extractTrainCode(trainUrl) {
  if (!trainUrl) return null;

  const match = trainUrl.match(/Train:[^.]+\.[^.]+\.(.+)$/);
  return match ? match[1] : null;
}

// 방향 결정 (destinationStation 기반)
function determineDirection(destinationStation, lineCode) {
  // 간단한 휴리스틱: 종착역 이름으로 방향 판단
  // 실제로는 더 정교한 로직이 필요할 수 있음

  // 마루노우치선: Ogikubo 방면 = backward, Ikebukuro 방면 = forward
  if (lineCode === 'M') {
    if (destinationStation?.includes('Ogikubo')) return 'backward';
    if (destinationStation?.includes('Ikebukuro') || destinationStation?.includes('Honancho')) return 'forward';
  }

  // 히비야선: NakaMeguro 방면 = forward, KitaSenju 방면 = backward
  if (lineCode === 'H') {
    if (destinationStation?.includes('NakaMeguro')) return 'forward';
    if (destinationStation?.includes('KitaSenju')) return 'backward';
  }

  return 'forward'; // 기본값
}

// 시간표 데이터 DB 저장
async function saveTimetable(stationCode, lineCode, timetableData) {
  let insertCount = 0;
  let skipCount = 0;

  for (const timetable of timetableData) {
    const calendarType = calendarTypeMap[timetable['odpt:calendar']] || 'weekday';
    const timetableObjects = timetable['odpt:stationTimetableObject'] || [];

    for (const train of timetableObjects) {
      const departureTime = train['odpt:departureTime'];
      if (!departureTime) {
        skipCount++;
        continue;
      }

      const trainCode = train['odpt:trainNumber'] || null;
      const trainType = extractTrainType(train['odpt:trainType']);

      // ODPT Station ID를 stationCode로 변환
      const destinationOdptId = train['odpt:destinationStation'];
      const destinationStation = await convertOdptIdToStationCode(destinationOdptId);

      const railDirection = train['odpt:railDirection']?.split('.').pop() || null;

      try {
        await db.query(`
          INSERT INTO stationTimeInfo
            (stationCode, departureTime, trainCode, trainType,
             destinationStation, railDirection, calendarType)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          stationCode,
          departureTime,
          trainCode,
          trainType,
          destinationStation,
          railDirection,
          calendarType
        ]);

        insertCount++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          skipCount++;
        } else {
          throw error;
        }
      }
    }
  }

  return { insertCount, skipCount };
}

// 메인 함수
async function syncTimetable() {
  try {
    console.log('🚇 역별 시간표 수집 시작\n');

    // 1. 모든 역 정보 가져오기
    const stations = await db.query(`
      SELECT
        sbl.stationCode,
        sbl.lineCode,
        sbl.odptId,
        si.stationNameJa,
        li.odptId as railway
      FROM stationByLineInfo sbl
      JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
      JOIN lineInfo li ON sbl.lineCode = li.lineCode
      WHERE sbl.odptId IS NOT NULL
      ORDER BY sbl.lineCode, sbl.stationCode
    `);

    console.log(`📊 총 ${stations.length}개 역 시간표 수집 시작\n`);

    let totalSuccess = 0;
    let totalFail = 0;
    let totalInserted = 0;
    let totalSkipped = 0;

    // 2. 각 역별로 시간표 수집
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      const progress = `[${i + 1}/${stations.length}]`;

      console.log(`${progress} ${station.stationCode} (${station.stationNameJa})`);

      try {
        // ODPT API 호출
        const timetableData = await fetchStationTimetable(
          station.stationCode,
          station.odptId,
          station.railway
        );

        if (timetableData.length === 0) {
          console.log(`  ⚠️  시간표 데이터 없음\n`);
          totalFail++;
          await delay(DELAY_MS);
          continue;
        }

        // DB 저장
        const { insertCount, skipCount } = await saveTimetable(
          station.stationCode,
          station.lineCode,
          timetableData
        );

        totalInserted += insertCount;
        totalSkipped += skipCount;
        totalSuccess++;

        console.log(`  ✅ ${insertCount}개 추가, ${skipCount}개 중복\n`);

        await delay(DELAY_MS);

      } catch (error) {
        console.error(`  ❌ 실패: ${error.message}\n`);
        totalFail++;
        await delay(DELAY_MS);
      }
    }

    // 3. 결과 요약
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 수집 완료');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ 성공: ${totalSuccess}개 역`);
    console.log(`❌ 실패: ${totalFail}개 역`);
    console.log(`📝 추가된 시간표: ${totalInserted}개`);
    console.log(`⏭️  중복 건너뜀: ${totalSkipped}개\n`);

    // 4. 최종 데이터 확인
    const finalCount = await db.query('SELECT COUNT(*) as total FROM stationTimeInfo');
    console.log(`💾 최종 DB 레코드: ${finalCount[0].total}개\n`);

  } catch (error) {
    console.error('❌ 수집 실패:', error.message);
    console.error(error.stack);
  } finally {
    await db.pool.end();
    process.exit(0);
  }
}

syncTimetable();
