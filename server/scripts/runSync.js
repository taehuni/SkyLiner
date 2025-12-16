// 전체 데이터 동기화 마스터 스크립트
// npm run sync 실행시 모든 필수 데이터를 순서대로 동기화합니다
require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

console.log('========================================');
console.log('🚀 SkyLiner 전체 데이터 동기화 시작');
console.log('========================================');
console.log('');

// 실행할 스크립트 목록 (순서 중요!)
const scripts = [
  {
    name: '노선 정보 수집',
    path: 'src/scripts/syncAllLines.js',
    required: true,
    description: 'Tokyo Metro 노선 정보 (ODPT API)'
  },
  {
    name: '역 정보 수집',
    path: 'src/scripts/syncAllStations.js',
    required: true,
    description: '전체 역 정보 및 환승 노선 (ODPT API + DeepL 번역)'
  },
  {
    name: '시간표 수집',
    path: 'src/scripts/syncStationTimetable.js',
    required: false,
    description: '역별 시간표 및 열차 정보 (ODPT API) - 경로 탐색용'
  },
  {
    name: '환승 정보 생성',
    path: 'src/scripts/syncTransferInfo.js',
    required: true,
    description: '환승역 환승 시간 정보 - 경로 탐색용'
  },
  {
    name: '장소 정보 수집',
    path: 'src/scripts/syncAllPlaces.js',
    required: true,
    description: '역 주변 관광지/장소 (Google Places API + DeepL 번역)'
  },
  {
    name: '날씨 정보 수집',
    path: 'src/scripts/syncWeather.js',
    required: false,
    description: '각 역의 현재 날씨 (Open-Meteo API - 무료)'
  }
];

// 스크립트 실행 함수
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, '..', scriptPath);

    console.log(`\n📂 파일: ${scriptPath}`);

    const child = spawn('node', [fullPath], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`스크립트 실패 (exit code: ${code})`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// 메인 실행 함수
async function runFullSync() {
  console.log('📋 동기화할 항목:\n');

  scripts.forEach((script, index) => {
    const badge = script.required ? '🔴 필수' : '⚪ 선택';
    console.log(`${index + 1}. ${badge} ${script.name}`);
    console.log(`   → ${script.description}\n`);
  });

  console.log('⚠️  주의사항:');
  console.log('   - 전체 소요 시간: 약 15-20분');
  console.log('   - Google Places API 비용: 약 $2-3 예상');
  console.log('   - 안정적인 인터넷 연결 필요');
  console.log('   - 중간에 중단하려면 Ctrl+C');
  console.log('');
  console.log('5초 후 시작합니다...');
  console.log('');

  // 5초 카운트다운
  for (let i = 5; i > 0; i--) {
    process.stdout.write(`${i}... `);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('시작!\n');

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;
  const results = [];

  // 각 스크립트 순차 실행
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    console.log('');
    console.log('========================================');
    console.log(`[${i + 1}/${scripts.length}] ${script.name}`);
    console.log('========================================');

    try {
      await runScript(script.path);
      console.log(`\n✅ ${script.name} 완료!`);
      successCount++;
      results.push({ script: script.name, status: '성공' });
    } catch (error) {
      console.error(`\n❌ ${script.name} 실패: ${error.message}`);
      failCount++;
      results.push({ script: script.name, status: '실패', error: error.message });

      // 필수 스크립트가 실패하면 중단
      if (script.required) {
        console.error('');
        console.error('⚠️  필수 스크립트가 실패했습니다.');
        console.error('   다음 스크립트를 건너뛰고 종료합니다.');
        break;
      } else {
        console.log('   선택 스크립트이므로 계속 진행합니다.');
      }
    }
  }

  // 최종 결과
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  console.log('');
  console.log('');
  console.log('========================================');
  console.log('📊 전체 동기화 완료');
  console.log('========================================');
  console.log('');
  console.log(`⏱️  소요 시간: ${minutes}분 ${seconds}초`);
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  console.log('');
  console.log('📋 상세 결과:');
  console.log('');

  results.forEach((result, index) => {
    const icon = result.status === '성공' ? '✅' : '❌';
    console.log(`${index + 1}. ${icon} ${result.script}: ${result.status}`);
    if (result.error) {
      console.log(`   → ${result.error}`);
    }
  });

  console.log('');
  console.log('========================================');
  console.log('');

  if (failCount === 0) {
    console.log('🎉 모든 동기화가 성공적으로 완료되었습니다!');
    console.log('');
    console.log('이제 서버를 실행하세요:');
    console.log('  npm run dev');
    console.log('');
    console.log('프론트엔드도 실행하세요 (루트 폴더에서):');
    console.log('  cd ..');
    console.log('  npm run dev');
  } else {
    console.log('⚠️  일부 동기화가 실패했습니다.');
    console.log('위의 오류 메시지를 확인하고 문제를 해결하세요.');
  }

  console.log('');
  process.exit(failCount > 0 ? 1 : 0);
}

// API 키 확인
function checkAPIKeys() {
  const requiredKeys = ['ODPT_API_KEY', 'GOOGLE_PLACES_API_KEY', 'DEEPL_API_KEY'];
  const missingKeys = [];

  requiredKeys.forEach(key => {
    if (!process.env[key]) {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    console.error('❌ 필수 API 키가 .env 파일에 없습니다:');
    console.error('');
    missingKeys.forEach(key => {
      console.error(`   - ${key}`);
    });
    console.error('');
    console.error('.env 파일을 확인하고 API 키를 추가하세요.');
    console.error('');
    process.exit(1);
  }
}

// 실행
checkAPIKeys();
runFullSync().catch(error => {
  console.error('');
  console.error('❌ 치명적 오류:', error.message);
  console.error(error.stack);
  process.exit(1);
});
