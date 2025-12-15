const db = require('./src/config/database');

/**
 * stationTimeInfo의 railDirection을 채우는 스크립트
 * destinationStation의 stationOrder를 기준으로 forward/backward 판단
 */

(async () => {
  try {
    console.log('=== railDirection 업데이트 시작 ===\n');

    // 모든 시간표 데이터 조회
    const timetables = await db.query(`
      SELECT
        sti.indexNo,
        sti.stationCode,
        sti.destinationStation,
        sbl1.lineCode as currentLineCode,
        sbl1.stationOrder as currentOrder,
        sbl2.lineCode as destLineCode,
        sbl2.stationOrder as destOrder
      FROM stationTimeInfo sti
      JOIN stationByLineInfo sbl1 ON sti.stationCode = sbl1.stationCode
      LEFT JOIN stationByLineInfo sbl2 ON sti.destinationStation = sbl2.stationCode
      WHERE sti.railDirection IS NULL
    `);

    console.log(`업데이트할 시간표 항목: ${timetables.length}개\n`);

    let updated = 0;
    let skipped = 0;

    for (const row of timetables) {
      let direction = null;

      if (row.destOrder !== null) {
        // 같은 노선이거나 관련 노선 (M과 Mb)인 경우
        const currentBase = row.currentLineCode.replace(/[a-z]/g, '');
        const destBase = row.destLineCode?.replace(/[a-z]/g, '') || '';

        if (currentBase === destBase || !row.destLineCode) {
          // stationOrder 비교
          if (row.destOrder > row.currentOrder) {
            direction = 'forward';
          } else if (row.destOrder < row.currentOrder) {
            direction = 'backward';
          }
        } else {
          // 다른 노선으로 가는 경우 (환승 등)
          // stationConnectionInfo에서 확인
          const connection = await db.query(
            `SELECT railDirection FROM stationConnectionInfo
             WHERE stationCode = ? AND nextStationCode = ?
             LIMIT 1`,
            [row.stationCode, row.destinationStation]
          );

          if (connection.length > 0) {
            direction = connection[0].railDirection;
          }
        }
      }

      if (direction) {
        await db.query(
          'UPDATE stationTimeInfo SET railDirection = ? WHERE indexNo = ?',
          [direction, row.indexNo]
        );
        updated++;

        if (updated % 100 === 0) {
          console.log(`${updated}개 업데이트 완료...`);
        }
      } else {
        skipped++;
      }
    }

    console.log(`\n=== 완료 ===`);
    console.log(`✅ 업데이트: ${updated}개`);
    console.log(`⚠️  건너뜀: ${skipped}개`);

    // 결과 확인
    console.log('\n=== M06 시간표 샘플 (업데이트 후) ===');
    const sample = await db.query(`
      SELECT stationCode, destinationStation, railDirection, departureTime
      FROM stationTimeInfo
      WHERE stationCode = 'M06' AND calendarType = 'weekday'
      ORDER BY departureTime
      LIMIT 10
    `);
    console.table(sample);

  } catch (error) {
    console.error('❌ 에러:', error.message);
  } finally {
    await db.pool.end();
  }
})();
