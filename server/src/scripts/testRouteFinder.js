// 경로 탐색 테스트
const { getRouteFinder } = require('../services/routeFinder');

async function test() {
  try {
    console.log('🧪 경로 탐색 테스트\n');

    const routeFinder = await getRouteFinder();

    // 1. 그래프 확인
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 그래프 정보');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const nodeCount = Object.keys(routeFinder.graph).length;
    console.log(`노드 수: ${nodeCount}개\n`);

    // M16과 H09 확인
    console.log('M16 (긴자 - 마루노우치) 연결:');
    if (routeFinder.graph['M16']) {
      console.log(`  엣지 수: ${routeFinder.graph['M16'].edges.length}개`);
      routeFinder.graph['M16'].edges.forEach(edge => {
        console.log(`  → ${edge.to} (${edge.type}) ${edge.time}분`);
      });
    } else {
      console.log('  ❌ M16 노드 없음');
    }

    console.log('\nH09 (긴자 - 히비야) 연결:');
    if (routeFinder.graph['H09']) {
      console.log(`  엣지 수: ${routeFinder.graph['H09'].edges.length}개`);
      routeFinder.graph['H09'].edges.forEach(edge => {
        console.log(`  → ${edge.to} (${edge.type}) ${edge.time}분`);
      });
    } else {
      console.log('  ❌ H09 노드 없음');
    }

    // 2. 테스트 케이스
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 테스트 케이스');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 테스트 1: 같은 노선
    console.log('1. 같은 노선 (M08 → M09)');
    const test1 = routeFinder.findShortestTime('M08', 'M09');
    if (test1) {
      console.log(`   ✅ 성공: ${test1.summary.totalTime}분, ${test1.summary.stops}개 역\n`);
    } else {
      console.log('   ❌ 실패\n');
    }

    // 테스트 2: 환승
    console.log('2. 환승 (M16 → H09)');
    const test2 = routeFinder.findShortestTime('M16', 'H09');
    if (test2) {
      console.log(`   ✅ 성공: ${test2.summary.totalTime}분, ${test2.summary.transfers}회 환승`);
      console.log(`   경로: ${test2.path.map(s => s.stationCode).join(' → ')}\n`);
    } else {
      console.log('   ❌ 실패\n');
    }

    // 테스트 3: 긴 경로
    console.log('3. 긴 경로 (M01 → H20)');
    const test3 = routeFinder.findShortestTime('M01', 'H20');
    if (test3) {
      console.log(`   ✅ 성공: ${test3.summary.totalTime}분, ${test3.summary.transfers}회 환승`);
      console.log(`   경로: ${test3.path.map(s => s.stationCode).join(' → ')}\n`);
    } else {
      console.log('   ❌ 실패\n');
    }

    // 테스트 4: 최소 환승
    console.log('4. 최소 환승 알고리즘 (M01 → H20)');
    const test4 = routeFinder.findFewestTransfers('M01', 'H20');
    if (test4) {
      console.log(`   ✅ 성공: ${test4.summary.totalTime}분, ${test4.summary.transfers}회 환승`);
      console.log(`   경로: ${test4.path.map(s => s.stationCode).join(' → ')}\n`);
    } else {
      console.log('   ❌ 실패\n');
    }

  } catch (error) {
    console.error('❌ 에러:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

test();
