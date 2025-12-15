// calendarType 파라미터 테스트
const { getRouteFinder } = require('../services/routeFinder');

async function test() {
  try {
    console.log('🧪 calendarType 파라미터 테스트\n');

    // 1. 평일 그래프
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1️⃣  평일 (weekday) 그래프');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const weekdayFinder = await getRouteFinder('weekday');
    const weekdayRoute = weekdayFinder.findShortestTime('M08', 'M10');

    if (weekdayRoute) {
      console.log(`M08 → M10 (평일)`);
      console.log(`  시간: ${weekdayRoute.summary.totalTime}분`);
      console.log(`  경로: ${weekdayRoute.path.map(s => s.stationCode).join(' → ')}\n`);
    }

    // 2. 주말 그래프
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2️⃣  주말 (holiday) 그래프');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const holidayFinder = await getRouteFinder('holiday');
    const holidayRoute = holidayFinder.findShortestTime('M08', 'M10');

    if (holidayRoute) {
      console.log(`M08 → M10 (주말)`);
      console.log(`  시간: ${holidayRoute.summary.totalTime}분`);
      console.log(`  경로: ${holidayRoute.path.map(s => s.stationCode).join(' → ')}\n`);
    }

    // 3. 비교
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3️⃣  시간 차이');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const timeDiff = holidayRoute.summary.totalTime - weekdayRoute.summary.totalTime;
    console.log(`평일: ${weekdayRoute.summary.totalTime}분`);
    console.log(`주말: ${holidayRoute.summary.totalTime}분`);
    console.log(`차이: ${timeDiff > 0 ? '+' : ''}${timeDiff}분\n`);

    if (timeDiff !== 0) {
      console.log('✅ calendarType 파라미터가 제대로 작동합니다!');
    } else {
      console.log('⚠️  평일/주말 시간이 같습니다. (데이터 확인 필요)');
    }

    // 4. 싱글톤 확인
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('4️⃣  싱글톤 인스턴스 확인');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const weekday2 = await getRouteFinder('weekday');
    const holiday2 = await getRouteFinder('SaturdayHoliday');

    console.log(`weekday 인스턴스 재사용: ${weekdayFinder === weekday2 ? '✅ 동일' : '❌ 다름'}`);
    console.log(`holiday 인스턴스 재사용: ${holidayFinder === holiday2 ? '✅ 동일' : '❌ 다름'}`);
    console.log(`weekday vs holiday: ${weekdayFinder === holidayFinder ? '❌ 동일 (문제!)' : '✅ 다름'}\n`);

    console.log('✅ 테스트 완료!');

  } catch (error) {
    console.error('❌ 에러:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

test();
