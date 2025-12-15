// Google Places API에서 영업시간 수집
const db = require('../config/database');
const { getPlaceDetails } = require('../services/googlePlaces');

// 딜레이 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Google Places API 요일을 우리 형식으로 변환
// Google: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
const dayMap = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
};

// Google 시간 형식(HHMM)을 HH:MM으로 변환
const formatTime = (timeString) => {
  if (!timeString) return null;
  const hours = timeString.substring(0, 2);
  const minutes = timeString.substring(2, 4);
  return `${hours}:${minutes}`;
};

// Google opening_hours를 우리 JSON 형식으로 변환
const transformOpeningHours = (openingHours) => {
  if (!openingHours || !openingHours.periods) {
    return null;
  }

  const result = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null
  };

  // periods 데이터 파싱
  openingHours.periods.forEach(period => {
    const dayName = dayMap[period.open.day];

    if (dayName) {
      result[dayName] = {
        open: formatTime(period.open.time),
        close: period.close ? formatTime(period.close.time) : '23:59'
      };
    }
  });

  return result;
};

async function syncPlaceOpeningHours() {
  try {
    console.log('🕐 장소 영업시간 동기화 시작\n');

    // 1. 모든 장소 조회
    console.log('1️⃣  placeInfo에서 장소 목록 조회...\n');

    const places = await db.query(`
      SELECT placeID, name
      FROM placeInfo
      WHERE isActive = true
      ORDER BY placeID
    `);

    console.log(`✅ 총 ${places.length}개 장소 발견\n`);

    if (places.length === 0) {
      console.log('❌ 처리할 장소가 없습니다.');
      return;
    }

    // 2. 각 장소의 영업시간 수집
    console.log('2️⃣  Google Places API에서 영업시간 수집 중...\n');

    let successCount = 0;
    let noDataCount = 0;
    let errorCount = 0;

    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      const progress = `[${i + 1}/${places.length}]`;

      try {
        console.log(`${progress} ${place.name}`);

        // Google Places API 호출
        const details = await getPlaceDetails(place.placeID);

        if (details.opening_hours) {
          // 영업시간 데이터 변환
          const openingHours = transformOpeningHours(details.opening_hours);

          if (openingHours) {
            // DB에 저장
            await db.query(`
              INSERT INTO placeOpeningInfo (placeID, openingHours)
              VALUES (?, ?)
              ON DUPLICATE KEY UPDATE openingHours = ?
            `, [place.placeID, JSON.stringify(openingHours), JSON.stringify(openingHours)]);

            console.log(`   ✅ 저장 완료`);

            // 영업시간 미리보기
            const hasAllNull = Object.values(openingHours).every(v => v === null);
            if (!hasAllNull) {
              const sampleDay = Object.entries(openingHours).find(([_, v]) => v !== null);
              if (sampleDay) {
                console.log(`   📋 예시: ${sampleDay[0]} ${sampleDay[1].open} - ${sampleDay[1].close}`);
              }
            }

            successCount++;
          } else {
            console.log(`   ⚠️  영업시간 데이터 파싱 실패`);
            noDataCount++;
          }
        } else {
          console.log(`   ⚠️  영업시간 정보 없음`);
          noDataCount++;
        }

        // Rate limit 방지 (100ms 대기)
        await delay(100);

      } catch (error) {
        console.log(`   ❌ 에러: ${error.message}`);
        errorCount++;

        // Rate limit 에러면 더 길게 대기
        if (error.message.includes('OVER_QUERY_LIMIT') || error.message.includes('429')) {
          console.log('   ⏳ Rate limit 감지, 2초 대기...');
          await delay(2000);
        }
      }

      // 10개마다 상태 출력
      if ((i + 1) % 10 === 0) {
        console.log(`\n📊 진행 상황: ${i + 1}/${places.length} (성공: ${successCount}, 데이터없음: ${noDataCount}, 실패: ${errorCount})\n`);
      }
    }

    // 3. 최종 결과
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 동기화 완료\n');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`⚠️  데이터 없음: ${noDataCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`📋 전체: ${places.length}개`);

    // 샘플 데이터 조회
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 저장된 데이터 샘플 (5개):\n');

    const samples = await db.query(`
      SELECT
        poi.placeID,
        pi.name,
        poi.openingHours
      FROM placeOpeningInfo poi
      JOIN placeInfo pi ON poi.placeID = pi.placeID
      LIMIT 5
    `);

    samples.forEach((sample, idx) => {
      console.log(`${idx + 1}. ${sample.name}`);
      const hours = JSON.parse(sample.openingHours);
      Object.entries(hours).forEach(([day, time]) => {
        if (time) {
          console.log(`   ${day}: ${time.open} - ${time.close}`);
        } else {
          console.log(`   ${day}: 휴무`);
        }
      });
      console.log();
    });

    console.log('✅ placeOpeningInfo 동기화 완료!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

syncPlaceOpeningHours();
