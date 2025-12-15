// 역간 거리 데이터 동기화
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// 역 코드 추출 (H-01_나카메구로 → H01)
function extractStationCode(stationStr) {
  if (!stationStr) return null;

  // "H-01_나카메구로" → "H-01"
  const match = stationStr.match(/^([A-Z]b?-\d+)/);
  if (!match) return null;

  // "H-01" → "H01", "Mb-01" → "Mb01"
  return match[1].replace('-', '');
}

async function syncStationDistance() {
  try {
    console.log('🚇 역간 거리 동기화 시작\n');

    // 1. JSON 파일 읽기
    const jsonPath = path.join('C:', 'Users', 'PC', '2_2_Work', 'Project', 'stationDistance.json');
    console.log(`📂 파일 읽기: ${jsonPath}\n`);

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const lineData = jsonData['도쿄메트로_역간거리_데이터'];

    let totalUpdates = 0;
    let successCount = 0;
    let notFoundCount = 0;

    // 2. 각 노선별 처리
    for (const [lineName, lineStations] of Object.entries(lineData)) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📍 ${lineName}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

      // 각 시작역별 처리
      for (const [startStation, distances] of Object.entries(lineStations)) {
        const startCode = extractStationCode(startStation);

        if (!startCode) {
          console.log(`⚠️  역 코드 추출 실패: ${startStation}`);
          continue;
        }

        console.log(`\n${startStation} (${startCode})`);

        let previousCode = startCode;

        // 거리 데이터 처리
        for (let i = 0; i < distances.length; i++) {
          const distData = distances[i];
          const nextStation = distData['다음역'];
          const distanceKm = distData['역간거리_km'];

          const nextCode = extractStationCode(nextStation);

          if (!nextCode) {
            console.log(`   ⚠️  역 코드 추출 실패: ${nextStation}`);
            continue;
          }

          // km → m 변환
          const distanceM = Math.round(distanceKm * 1000);

          try {
            // stationtimeinfo 업데이트
            const result = await db.query(`
              UPDATE stationtimeinfo
              SET distanceToNextStation = ?
              WHERE stationCode = ?
                AND nextStationCode = ?
            `, [distanceM, previousCode, nextCode]);

            totalUpdates++;

            if (result.affectedRows > 0) {
              console.log(`   ✅ ${previousCode} → ${nextCode}: ${distanceKm}km (${distanceM}m) [${result.affectedRows}개 업데이트]`);
              successCount++;
            } else {
              console.log(`   ⚠️  ${previousCode} → ${nextCode}: ${distanceKm}km - DB에 해당 레코드 없음`);
              notFoundCount++;
            }

          } catch (error) {
            console.log(`   ❌ ${previousCode} → ${nextCode}: ${error.message}`);
          }

          // 다음 반복을 위해 이전 역 업데이트
          previousCode = nextCode;
        }
      }
    }

    // 3. 최종 결과
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 동기화 완료\n');
    console.log(`처리한 거리 데이터: ${totalUpdates}개`);
    console.log(`✅ 업데이트 성공: ${successCount}개`);
    console.log(`⚠️  DB에 없음: ${notFoundCount}개`);

    // 4. 업데이트된 데이터 확인
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 업데이트된 데이터 샘플:\n');

    const samples = await db.query(`
      SELECT
        stationCode,
        nextStationCode,
        distanceToNextStation,
        timeToNextStation
      FROM stationtimeinfo
      WHERE distanceToNextStation IS NOT NULL
      LIMIT 10
    `);

    samples.forEach((s, idx) => {
      console.log(`${idx + 1}. ${s.stationCode} → ${s.nextStationCode}`);
      console.log(`   거리: ${s.distanceToNextStation}m (${(s.distanceToNextStation / 1000).toFixed(1)}km)`);
      console.log(`   시간: ${s.timeToNextStation}분\n`);
    });

    // 5. 통계
    const stats = await db.query(`
      SELECT
        COUNT(*) as total,
        COUNT(distanceToNextStation) as withDistance,
        COUNT(*) - COUNT(distanceToNextStation) as withoutDistance
      FROM stationtimeinfo
    `);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 전체 통계\n');
    console.log(`전체 레코드: ${stats[0].total}개`);
    console.log(`거리 데이터 있음: ${stats[0].withDistance}개`);
    console.log(`거리 데이터 없음: ${stats[0].withoutDistance}개`);

    console.log('\n✅ 역간 거리 동기화 완료!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

syncStationDistance();
