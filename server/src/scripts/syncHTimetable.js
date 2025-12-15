// H 노선 (히비야선) 시간표 수집
const axios = require('axios');
const db = require('../config/database');
require('dotenv').config();

const ODPT_API_KEY = process.env.ODPT_API_KEY;
const BASE_URL = 'https://api.odpt.org/api/v4';

const calendarTypeMap = {
  'odpt.Calendar:Weekday': 'weekday',
  'odpt.Calendar:SaturdayHoliday': 'holiday',
  'odpt.Calendar:Holiday': 'holiday'
};

function extractTrainType(trainTypeUrl) {
  if (!trainTypeUrl) return null;
  const typeMap = {
    'Local': '普通',
    'Express': '快速',
    'RapidExpress': '急行'
  };
  const match = trainTypeUrl.match(/\.([A-Za-z]+)$/);
  return match ? (typeMap[match[1]] || match[1]) : null;
}

// ODPT Station ID를 stationCode로 변환하는 함수
async function convertOdptIdToStationCode(odptStationId) {
  if (!odptStationId) return null;

  try {
    const result = await db.query(
      'SELECT stationCode FROM stationByLineInfo WHERE odptId = ?',
      [odptStationId]
    );

    if (result.length > 0) {
      return result[0].stationCode;
    }

    // 못 찾으면 영어 이름 그대로 반환 (하위 호환성)
    return odptStationId.split('.').pop();
  } catch (error) {
    console.error('  ⚠️  stationCode 변환 실패:', error.message);
    return odptStationId.split('.').pop();
  }
}

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
    if (error.response?.status === 404) return [];
    throw error;
  }
}

async function saveTimetable(stationCode, timetableData) {
  let insertCount = 0;
  let skipCount = 0;

  for (const timetable of timetableData) {
    const calendarType = calendarTypeMap[timetable['odpt:calendar']] || 'weekday';
    const trainTimetables = timetable['odpt:stationTimetableObject'] || [];

    for (const train of trainTimetables) {
      const departureTime = train['odpt:departureTime'];
      const trainCode = train['odpt:trainNumber'] || null;
      const trainTypeUrl = train['odpt:trainType'];
      const trainType = extractTrainType(trainTypeUrl);

      // ODPT Station ID를 stationCode로 변환
      const destinationOdptId = train['odpt:destinationStation']?.[0];
      const destinationStation = await convertOdptIdToStationCode(destinationOdptId);

      const railDirection = train['odpt:railDirection']?.split('.').pop() || null;

      if (!departureTime) continue;

      try {
        await db.query(
          `INSERT INTO stationTimeInfo
           (stationCode, departureTime, calendarType, trainCode, trainType, destinationStation, railDirection)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [stationCode, departureTime, calendarType, trainCode, trainType, destinationStation, railDirection]
        );
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

async function syncHTimetable() {
  try {
    console.log('🚇 H 노선 (히비야선) 시간표 수집 시작\n');

    const stations = await db.query(`
      SELECT sbl.stationCode, sbl.lineCode, sbl.odptId, si.stationNameJa, li.odptId as railway
      FROM stationByLineInfo sbl
      JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
      JOIN lineInfo li ON sbl.lineCode = li.lineCode
      WHERE sbl.lineCode = 'H' AND sbl.odptId IS NOT NULL
    `);

    console.log(`📊 ${stations.length}개 역 처리\n`);

    let total = 0;

    for (const station of stations) {
      console.log(`🚇 ${station.stationCode} (${station.stationNameJa})`);

      const timetableData = await fetchStationTimetable(
        station.stationCode,
        station.odptId,
        station.railway
      );

      if (timetableData.length === 0) {
        console.log(`  ⚠️  시간표 데이터 없음\n`);
        continue;
      }

      const { insertCount, skipCount } = await saveTimetable(
        station.stationCode,
        timetableData
      );

      total += insertCount;
      console.log(`  ✅ ${insertCount}개 추가, ${skipCount}개 중복\n`);
    }

    console.log(`✅ 완료! 총 ${total}개 시간표 추가`);

  } catch (error) {
    console.error('❌ 에러:', error.message);
  } finally {
    await db.pool.end();
    process.exit(0);
  }
}

syncHTimetable();
