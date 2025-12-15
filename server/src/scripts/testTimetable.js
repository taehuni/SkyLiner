// 시간표 데이터 확인
const db = require('../config/database');

async function test() {
  try {
    console.log('🕐 시간표 데이터 확인\n');

    // 1. 전체 통계
    const total = await db.query('SELECT COUNT(*) as count FROM stationTimeInfo');
    console.log(`총 시간표 레코드: ${total[0].count}개\n`);

    // 2. M08역 평일 시간표 샘플
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 M08 신주쿠역 평일 시간표 (첫 10개)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const weekdayTimes = await db.query(`
      SELECT departureTime, trainCode, trainType, destinationStation, railDirection
      FROM stationTimeInfo
      WHERE stationCode = 'M08' AND calendarType = 'weekday'
      ORDER BY departureTime
      LIMIT 10
    `);

    weekdayTimes.forEach(t => {
      console.log(`  ${t.departureTime} - ${t.trainType} ${t.destinationStation}행 (${t.trainCode}) [${t.railDirection}]`);
    });

    // 3. 역별 시간표 개수
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 역별 시간표 개수 (상위 5개)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const perStation = await db.query(`
      SELECT stationCode, COUNT(*) as count
      FROM stationTimeInfo
      GROUP BY stationCode
      ORDER BY count DESC
      LIMIT 5
    `);

    perStation.forEach(s => {
      console.log(`  ${s.stationCode}: ${s.count}개`);
    });

    console.log('\n✅ 시간표 데이터 정상!\n');

  } catch (error) {
    console.error('❌ 에러:', error.message);
  } finally {
    await db.pool.end();
    process.exit(0);
  }
}

test();
