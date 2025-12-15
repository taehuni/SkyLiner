// transferInfo 테이블 채우기
const db = require('../config/database');

async function syncTransferInfo() {
  try {
    console.log('🚇 환승 정보 동기화 시작\n');

    // 환승역 찾기 (2개 이상의 노선이 있는 역)
    const transferStations = await db.query(`
      SELECT
        si.stationGroupCode,
        si.stationNameJa,
        si.stationNameKo,
        GROUP_CONCAT(sbl.stationCode ORDER BY sbl.stationCode) as stationCodes,
        GROUP_CONCAT(sbl.lineCode ORDER BY sbl.lineCode) as lineCodes,
        COUNT(DISTINCT sbl.lineCode) as lineCount
      FROM stationInfo si
      JOIN stationByLineInfo sbl ON si.stationGroupCode = sbl.stationGroupCode
      GROUP BY si.stationGroupCode
      HAVING lineCount > 1
      ORDER BY si.stationGroupCode
    `);

    console.log(`✅ 환승역 ${transferStations.length}개 발견\n`);

    if (transferStations.length === 0) {
      console.log('❌ 환승역이 없습니다.');
      return;
    }

    // 기존 transferInfo 데이터 삭제
    await db.query('DELETE FROM transferInfo');
    console.log('🗑️  기존 환승 데이터 삭제 완료\n');

    let totalTransfers = 0;

    for (const station of transferStations) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🔸 ${station.stationNameJa} (${station.stationNameKo})`);
      console.log(`   GroupCode: ${station.stationGroupCode}`);
      console.log(`   노선: ${station.lineCodes}`);

      const codes = station.stationCodes.split(',');
      console.log(`   역 코드: ${codes.join(', ')}\n`);

      // 모든 노선 조합에 대해 양방향 환승 생성
      for (let i = 0; i < codes.length; i++) {
        for (let j = 0; j < codes.length; j++) {
          if (i !== j) {
            const fromCode = codes[i];
            const toCode = codes[j];

            // 기본 환승 시간: 3분
            // TODO: ODPT API나 실제 데이터가 있으면 그걸로 교체
            const travelTime = 3;

            await db.query(`
              INSERT INTO transferInfo (fromStationCode, toStationCode, travelTime)
              VALUES (?, ?, ?)
            `, [fromCode, toCode, travelTime]);

            console.log(`   ✅ ${fromCode} → ${toCode}: ${travelTime}분`);
            totalTransfers++;
          }
        }
      }
    }

    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log('📊 동기화 결과\n');
    console.log(`✅ 환승역: ${transferStations.length}개`);
    console.log(`✅ 환승 조합: ${totalTransfers}개`);

    // 결과 확인
    const result = await db.query(`
      SELECT
        ti.fromStationCode,
        ti.toStationCode,
        ti.travelTime,
        si.stationNameJa,
        si.stationNameKo
      FROM transferInfo ti
      JOIN stationByLineInfo sbl ON ti.fromStationCode = sbl.stationCode
      JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
      ORDER BY si.stationGroupCode, ti.fromStationCode, ti.toStationCode
    `);

    console.log(`\n📋 전체 환승 정보:\n`);
    let currentStation = '';
    result.forEach(r => {
      if (currentStation !== r.stationNameJa) {
        currentStation = r.stationNameJa;
        console.log(`\n🔸 ${r.stationNameJa} (${r.stationNameKo})`);
      }
      console.log(`   ${r.fromStationCode} → ${r.toStationCode}: ${r.travelTime}분`);
    });

    console.log('\n✅ transferInfo 동기화 완료!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

syncTransferInfo();
