// 모든 Tokyo Metro 노선 정보 수집
require('dotenv').config();
const { query } = require('../config/database');
const axios = require('axios');

console.log('========================================');
console.log('🚇 Tokyo Metro 노선 정보 수집');
console.log('========================================');
console.log('');

const syncAllLines = async () => {
  try {
    console.log('📍 ODPT Railway API 호출 중...');

    // Tokyo Metro의 모든 노선 정보 가져오기
    const response = await axios.get('https://api.odpt.org/api/v4/odpt:Railway', {
      params: {
        'acl:consumerKey': process.env.ODPT_API_KEY,
        'odpt:operator': 'odpt.Operator:TokyoMetro'
      }
    });

    const railways = response.data;
    console.log(`✅ ${railways.length}개 노선 정보 받음`);
    console.log('');

    // 각 노선 정보 저장
    console.log('💾 노선 정보 저장 중...');
    let savedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;

    for (const railway of railways) {
      // 노선 코드 추출
      const lineCode = railway['odpt:lineCode'] || '';

      if (!lineCode) {
        console.log('  ⚠️  노선 코드 없음 - 건너뜀');
        continue;
      }

      // 노선 이름 추출 (모든 언어)
      const railwayTitle = railway['odpt:railwayTitle'] || {};
      const lineNameJa = railwayTitle.ja || railway['dc:title'] || '';
      const lineNameEn = railwayTitle.en || '';
      const lineNameKo = railwayTitle.ko || '';
      const lineNameJa_Hkt = railwayTitle['ja-Hrkt'] || '';
      const lineNameZh_Hans = railwayTitle['zh-Hans'] || '';
      const lineNameZh_Hant = railwayTitle['zh-Hant'] || '';

      // 기타 정보
      const operator = railway['odpt:operator'] || '';
      const stationOrder = railway['odpt:stationOrder'] || [];
      const stationNumber = stationOrder.length;
      const color = railway['odpt:color'] || '';
      const odptId = railway['owl:sameAs'] || '';

      // 이미 존재하는지 확인
      const existing = await query(
        'SELECT * FROM lineInfo WHERE lineCode = ?',
        [lineCode]
      );

      if (existing.length > 0) {
        // 이미 존재하면 업데이트
        try {
          await query(
            `UPDATE lineInfo SET
             operator = ?, stationNumber = ?,
             lineNameJa = ?, lineNameJa_Hkt = ?, lineNameKo = ?,
             lineNameEn = ?, lineNameZh_Hans = ?, lineNameZh_Hant = ?,
             color = ?, odptId = ?
             WHERE lineCode = ?`,
            [
              operator,
              stationNumber,
              lineNameJa,
              lineNameJa_Hkt,
              lineNameKo,
              lineNameEn,
              lineNameZh_Hans,
              lineNameZh_Hant,
              color,
              odptId,
              lineCode
            ]
          );
          updatedCount++;
          console.log(`  ↻ ${lineNameJa} (${lineCode}) - 업데이트`);
        } catch (err) {
          console.log(`  ✗ ${lineNameJa} (${lineCode}) - 업데이트 실패: ${err.message}`);
        }
      } else {
        // 새로 저장
        try {
          await query(
            `INSERT INTO lineInfo
             (lineCode, operator, stationNumber,
              lineNameJa, lineNameJa_Hkt, lineNameKo, lineNameEn,
              lineNameZh_Hans, lineNameZh_Hant, color, odptId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              lineCode,
              operator,
              stationNumber,
              lineNameJa,
              lineNameJa_Hkt,
              lineNameKo,
              lineNameEn,
              lineNameZh_Hans,
              lineNameZh_Hant,
              color,
              odptId
            ]
          );
          savedCount++;
          console.log(`  ✓ ${lineNameJa} (${lineCode}) - 저장 완료`);
        } catch (err) {
          console.log(`  ✗ ${lineNameJa} (${lineCode}) - 저장 실패: ${err.message}`);
        }
      }
    }

    console.log('');
    console.log('========================================');
    console.log('📊 결과');
    console.log('========================================');
    console.log(`✅ 새로 저장: ${savedCount}개`);
    console.log(`↻ 업데이트: ${updatedCount}개`);
    console.log(`📍 총: ${railways.length}개`);
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
const run = async () => {1
  if (!process.env.ODPT_API_KEY) {
    console.error('❌ ODPT_API_KEY가 .env 파일에 없습니다!');
    process.exit(1);
  }

  await syncAllLines();

  console.log('✅ 완료!');
  console.log('');
  console.log('다음 확인 명령어:');
  console.log('  mysql> SELECT lineCode, lineNameJa, lineNameKo, stationNumber FROM lineInfo;');
  console.log('');

  process.exit(0);
};

run();
1