// 전체 Tokyo Metro 노선의 역 정보 수집
require('dotenv').config();
const { query } = require('../config/database');
const axios = require('axios');
const translator = require('../services/translator');

console.log('========================================');
console.log('🚇 Tokyo Metro 전체 역 정보 수집');
console.log('========================================');
console.log('');

// 노선별 odptId 매핑
const RAILWAY_MAP = {
  'C': 'odpt.Railway:TokyoMetro.Chiyoda',
  'F': 'odpt.Railway:TokyoMetro.Fukutoshin',
  'G': 'odpt.Railway:TokyoMetro.Ginza',
  'H': 'odpt.Railway:TokyoMetro.Hibiya',
  'M': 'odpt.Railway:TokyoMetro.Marunouchi',
  'Mb': 'odpt.Railway:TokyoMetro.MarunouchiBranch',
  'N': 'odpt.Railway:TokyoMetro.Namboku',
  'T': 'odpt.Railway:TokyoMetro.Tozai',
  'Y': 'odpt.Railway:TokyoMetro.Yurakucho',
  'Z': 'odpt.Railway:TokyoMetro.Hanzomon'
};

// 환승 정보 저장 헬퍼 함수
const saveConnectingRailways = async (stationGroupCode, station) => {
  try {
    const connectingRailways = station['odpt:connectingRailway'] || [];
    if (connectingRailways.length === 0) return;

    let savedRailwayCount = 0;

    for (const railwayId of connectingRailways) {
      const existing = await query(
        'SELECT * FROM connectingRailwayInfo WHERE stationGroupCode = ? AND railwayName = ?',
        [stationGroupCode, railwayId]
      );

      if (existing.length === 0) {
        await query(
          `INSERT INTO connectingRailwayInfo (stationGroupCode, railwayName)
           VALUES (?, ?)`,
          [stationGroupCode, railwayId]
        );
        savedRailwayCount++;
      }
    }

    if (savedRailwayCount > 0) {
      console.log(`    └─ 환승 정보 ${savedRailwayCount}개 저장`);
    }
  } catch (err) {
    console.log(`    └─ 환승 정보 저장 실패: ${err.message}`);
  }
};

const syncLineStations = async (lineCode, railwayOdptId) => {
  try {
    console.log(`\n📍 [${lineCode}선] 처리 시작...`);

    // 1. Railway API로 역 순서 정보 가져오기
    const railwayResponse = await axios.get('https://api.odpt.org/api/v4/odpt:Railway', {
      params: {
        'acl:consumerKey': process.env.ODPT_API_KEY,
        'owl:sameAs': railwayOdptId
      }
    });

    let stationOrderMap = {};
    if (railwayResponse.data && railwayResponse.data[0]) {
      const stationOrder = railwayResponse.data[0]['odpt:stationOrder'] || [];
      console.log(`  ✅ 역 순서 정보: ${stationOrder.length}개 역`);

      stationOrder.forEach(item => {
        const odptId = item['odpt:station'];
        stationOrderMap[odptId] = item['odpt:index'];
      });
    }

    // 2. 역 정보 가져오기
    const stationResponse = await axios.get('https://api.odpt.org/api/v4/odpt:Station', {
      params: {
        'acl:consumerKey': process.env.ODPT_API_KEY,
        'odpt:railway': railwayOdptId
      }
    });

    const stations = stationResponse.data;
    console.log(`  ✅ 역 정보: ${stations.length}개 역`);

    // 3. 역 정보 저장
    let savedCount = 0;
    let updatedCount = 0;

    for (const station of stations) {
      const stationTitle = station['odpt:stationTitle'] || {};
      const stationNameJa = stationTitle.ja || station['dc:title'];
      const stationNameEn = stationTitle.en || '';
      let stationNameKo = stationTitle.ko || '';
      const stationNameJa_Hkt = stationTitle['ja-Hrkt'] || '';
      const stationNameZh_Hans = stationTitle['zh-Hans'] || '';
      const stationNameZh_Hant = stationTitle['zh-Hant'] || '';

      // 한국어가 없으면 자동 번역
      if (!stationNameKo && stationNameJa) {
        stationNameKo = await translator.japaneseToKorean(stationNameJa);
        console.log(`    🌐 번역: ${stationNameJa} → ${stationNameKo}`);
      }

      const lat = station['geo:lat'];
      const lon = station['geo:long'];
      const odptId = station['owl:sameAs'] || '';
      const stationOrder = stationOrderMap[odptId] || null;
      const exitInfo = station['odpt:exit'] ? JSON.stringify(station['odpt:exit']) : null;

      const stationCode = station['odpt:stationCode'] || '';
      const normalizedCode = stationCode.replace('-', '');

      // 이미 존재하는지 확인
      const existing = await query(
        'SELECT * FROM stationByLineInfo WHERE stationCode = ? AND lineCode = ?',
        [normalizedCode, lineCode]
      );

      // 같은 stationCode를 가진 다른 노선의 역이 있는지 확인
      const sameStation = await query(
        'SELECT stationGroupCode FROM stationByLineInfo WHERE stationCode = ?',
        [normalizedCode]
      );

      if (existing.length > 0) {
        // UPDATE
        const stationGroupCode = existing[0].stationGroupCode;

        await query(
          `UPDATE stationInfo SET
           stationNameJa = ?, stationNameJa_Hkt = ?, stationNameKo = ?,
           stationNameEn = ?, stationNameZh_Hans = ?, stationNameZh_Hant = ?,
           latitude = ?, longitude = ?, odptId = ?, exitInfo = ?
           WHERE stationGroupCode = ?`,
          [stationNameJa, stationNameJa_Hkt, stationNameKo, stationNameEn,
           stationNameZh_Hans, stationNameZh_Hant, lat, lon, odptId, exitInfo, stationGroupCode]
        );

        await query(
          `UPDATE stationByLineInfo SET odptId = ?, stationOrder = ?
           WHERE stationCode = ? AND lineCode = ?`,
          [odptId, stationOrder, normalizedCode, lineCode]
        );

        updatedCount++;
        console.log(`    ↻ ${stationNameJa} (${normalizedCode})`);

        await saveConnectingRailways(stationGroupCode, station);
        continue;
      }

      // INSERT
      let stationGroupCode;

      if (sameStation.length > 0) {
        // 같은 역이 다른 노선에 이미 있으면 재사용
        stationGroupCode = sameStation[0].stationGroupCode;
        console.log(`    ⊕ ${stationNameJa} (${normalizedCode}) - 기존 역에 노선 추가`);
      } else {
        // 새로운 역 생성
        const result = await query(
          `INSERT INTO stationInfo
           (stationNameJa, stationNameJa_Hkt, stationNameKo, stationNameEn,
            stationNameZh_Hans, stationNameZh_Hant, latitude, longitude,
            odptId, exitInfo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [stationNameJa, stationNameJa_Hkt, stationNameKo, stationNameEn,
           stationNameZh_Hans, stationNameZh_Hant, lat, lon, odptId, exitInfo]
        );

        stationGroupCode = result.insertId;
        console.log(`    ✓ ${stationNameJa} (${normalizedCode})`);
      }

      // stationByLineInfo 저장
      await query(
        `INSERT INTO stationByLineInfo
         (stationCode, stationGroupCode, lineCode, odptId, stationOrder)
         VALUES (?, ?, ?, ?, ?)`,
        [normalizedCode, stationGroupCode, lineCode, odptId, stationOrder]
      );

      savedCount++;
      await saveConnectingRailways(stationGroupCode, station);
    }

    console.log(`  📊 [${lineCode}선] 완료: 새로 저장 ${savedCount}개, 업데이트 ${updatedCount}개\n`);

    return { savedCount, updatedCount };

  } catch (error) {
    console.error(`  ❌ [${lineCode}선] 에러:`, error.message);
    return { savedCount: 0, updatedCount: 0 };
  }
};

const run = async () => {
  if (!process.env.ODPT_API_KEY) {
    console.error('❌ ODPT_API_KEY가 .env 파일에 없습니다!');
    process.exit(1);
  }

  let totalSaved = 0;
  let totalUpdated = 0;

  for (const [lineCode, railwayOdptId] of Object.entries(RAILWAY_MAP)) {
    const { savedCount, updatedCount } = await syncLineStations(lineCode, railwayOdptId);
    totalSaved += savedCount;
    totalUpdated += updatedCount;
  }

  console.log('========================================');
  console.log('📊 전체 결과');
  console.log('========================================');
  console.log(`✅ 새로 저장: ${totalSaved}개 역`);
  console.log(`↻ 업데이트: ${totalUpdated}개 역`);
  console.log('');
  console.log('✅ 완료!');

  process.exit(0);
};

run();
