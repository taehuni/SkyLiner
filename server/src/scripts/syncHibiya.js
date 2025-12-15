// 히비야선 역 정보 수집 (수정 버전)
require('dotenv').config();
const { query } = require('../config/database');
const axios = require('axios');

console.log('========================================');
console.log('🚇 히비야선 역 정보 수집');
console.log('========================================');
console.log('');

// 환승 정보 저장 헬퍼 함수
const saveConnectingRailways = async (stationGroupCode, station) => {
  try {
    // odpt:connectingRailway 배열 추출
    const connectingRailways = station['odpt:connectingRailway'] || [];

    if (connectingRailways.length === 0) {
      return; // 환승 노선 없음
    }

    let savedRailwayCount = 0;

    // 각 환승 노선마다 저장
    for (const railwayId of connectingRailways) {
      // 중복 체크
      const existing = await query(
        'SELECT * FROM connectingRailwayInfo WHERE stationGroupCode = ? AND railwayName = ?',
        [stationGroupCode, railwayId]
      );

      // 없으면 INSERT
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

const syncHibiyaStations = async () => {
  try {
    // 1. lineInfo에서 히비야선 존재 확인
    console.log('📝 노선 정보 확인 중...');
    const lineCheck = await query(
      'SELECT * FROM lineInfo WHERE lineCode = ?',
      ['H']
    );

    if (lineCheck.length === 0) {
      console.error('');
      console.error('❌ lineInfo에 히비야선(H) 정보가 없습니다!');
      console.error('');
      console.error('먼저 다음 명령어를 실행하세요:');
      console.error('  node src/scripts/syncAllLines.js');
      console.error('');
      process.exit(1);
    }

    console.log(`✅ 히비야선 정보 확인: ${lineCheck[0].lineNameJa}`);
    console.log('');

    // 2. 역 정보 가져오기
    console.log('📍 ODPT Station API 호출 중...');
    const response = await axios.get('https://api.odpt.org/api/v4/odpt:Station', {
      params: {
        'acl:consumerKey': process.env.ODPT_API_KEY,
        'odpt:railway': 'odpt.Railway:TokyoMetro.Hibiya'
      }
    });

    const stations = response.data;
    console.log(`✅ ${stations.length}개 역 정보 받음`);
    console.log('');
    
    // 역 정보 저장
    console.log('📍 역 정보 저장 중...');
    let savedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const station of stations) {
      // 역 이름 추출 (모든 언어)
      const stationTitle = station['odpt:stationTitle'] || {};
      const stationNameJa = stationTitle.ja || station['dc:title'];
      const stationNameEn = stationTitle.en || '';
      const stationNameKo = stationTitle.ko || '';
      const stationNameJa_Hkt = stationTitle['ja-Hrkt'] || '';
      const stationNameZh_Hans = stationTitle['zh-Hans'] || '';
      const stationNameZh_Hant = stationTitle['zh-Hant'] || '';

      // 위경도 정보
      const lat = station['geo:lat'];
      const lon = station['geo:long'];

      // ODPT ID
      const odptId = station['owl:sameAs'] || '';

      // 출구 정보 (JSON)
      const exitInfo = station['odpt:exit'] ? JSON.stringify(station['odpt:exit']) : null;

      // 역 번호 추출 (예: "H-01" → "H01")
      const stationCode = station['odpt:stationCode'] || '';
      const normalizedCode = stationCode.replace('-', '');
      
      // 이미 존재하는지 확인
      const existing = await query(
        'SELECT * FROM stationByLineInfo WHERE stationCode = ? AND lineCode = ?',
        [normalizedCode, 'H']
      );

      if (existing.length > 0) {
        // 이미 존재하면 UPDATE
        const stationGroupCode = existing[0].stationGroupCode;

        try {
          await query(
            `UPDATE stationInfo SET
             stationNameJa = ?, stationNameJa_Hkt = ?, stationNameKo = ?,
             stationNameEn = ?, stationNameZh_Hans = ?, stationNameZh_Hant = ?,
             latitude = ?, longitude = ?, odptId = ?, exitInfo = ?
             WHERE stationGroupCode = ?`,
            [
              stationNameJa,
              stationNameJa_Hkt,
              stationNameKo,
              stationNameEn,
              stationNameZh_Hans,
              stationNameZh_Hant,
              lat,
              lon,
              odptId,
              exitInfo,
              stationGroupCode
            ]
          );

          updatedCount++;
          console.log(`  ↻ ${stationNameJa} (${normalizedCode}) - 업데이트`);

        } catch (err) {
          console.log(`  ✗ ${stationNameJa} (${normalizedCode}) - 업데이트 실패: ${err.message}`);
        }

        // 환승 정보 저장 (UPDATE 경로)
        await saveConnectingRailways(stationGroupCode, station);

        continue;
      }
      
      try {
        // 1. stationInfo 테이블에 저장
        const result = await query(
          `INSERT INTO stationInfo
           (stationNameJa, stationNameJa_Hkt, stationNameKo, stationNameEn,
            stationNameZh_Hans, stationNameZh_Hant, latitude, longitude,
            odptId, exitInfo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            stationNameJa,
            stationNameJa_Hkt,
            stationNameKo,
            stationNameEn,
            stationNameZh_Hans,
            stationNameZh_Hant,
            lat,
            lon,
            odptId,
            exitInfo
          ]
        );
        
        const stationGroupCode = result.insertId;
        
        // 2. stationByLineInfo 테이블에 저장
        await query(
          `INSERT INTO stationByLineInfo 
           (stationCode, stationGroupCode, lineCode)
           VALUES (?, ?, ?)`,
          [normalizedCode, stationGroupCode, 'H']
        );
        
        savedCount++;
        console.log(`  ✓ ${stationNameJa} (${normalizedCode}) - 저장 완료`);

        // 환승 정보 저장 (INSERT 경로)
        await saveConnectingRailways(stationGroupCode, station);

      } catch (err) {
        console.log(`  ✗ ${stationNameJa} - 저장 실패: ${err.message}`);
      }
    }
    
    console.log('');
    console.log('========================================');
    console.log('📊 결과');
    console.log('========================================');
    console.log(`✅ 새로 저장: ${savedCount}개`);
    console.log(`↻ 업데이트: ${updatedCount}개`);
    console.log(`📍 총: ${stations.length}개`);
    console.log('');
    
  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
  }
};

// API 키 확인 후 실행
const run = async () => {
  if (!process.env.ODPT_API_KEY) {
    console.error('❌ ODPT_API_KEY가 .env 파일에 없습니다!');
    process.exit(1);
  }
  
  await syncHibiyaStations();
  
  console.log('✅ 완료!');
  console.log('');
  console.log('다음 확인 명령어:');
  console.log('  mysql> SELECT s.stationNameJa, b.stationCode, b.lineCode');
  console.log('         FROM stationInfo s');
  console.log('         JOIN stationByLineInfo b ON s.stationGroupCode = b.stationGroupCode');
  console.log('         WHERE b.lineCode = "H";');
  console.log('');
  
  process.exit(0);
};

run();