// 모든 역의 장소 수집 (마루노우치선 + 히비야선) - 최적화 버전
require('dotenv').config();
const { query } = require('../config/database');
const axios = require('axios');
const translator = require('../services/translator');

console.log('========================================');
console.log('🚇 전체 역 장소 수집');
console.log('========================================');
console.log('');

// 사진 URL 생성 함수
const getPhotoUrl = (photoReference, maxWidth = 400) => {
  if (!photoReference) return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
};

// 딜레이 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Google Places API 요일을 우리 형식으로 변환
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

const syncPlacesForStation = async (station) => {
  try {
    let allPlaces = [];
    let nextPageToken = null;
    let pageCount = 0;
    const maxPages = 3; // 50개 수집 (20 + 20 + 10)

    // 페이지네이션으로 최대 50개 수집
    do {
      const params = {
        location: `${station.latitude},${station.longitude}`,
        radius: 500,
        key: process.env.GOOGLE_PLACES_API_KEY,
        language: 'ko'
      };

      if (nextPageToken) {
        params.pagetoken = nextPageToken;
      }

      // Google Places Nearby Search API 호출
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params
      });

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        if (pageCount === 0) {
          console.log(`  ❌ ${station.stationNameJa} - API 에러: ${response.data.status}`);
          return { saved: 0, updated: 0, skipped: 0, total: 0, detailsCalls: 0, apiCalls: 0 };
        }
        break; // 첫 페이지 이후 에러는 무시하고 수집한 데이터 처리
      }

      if (response.data.results && response.data.results.length > 0) {
        allPlaces.push(...response.data.results);
      }

      nextPageToken = response.data.next_page_token || null;
      pageCount++;

      // next_page_token이 있으면 2초 대기 (Google API 요구사항)
      if (nextPageToken && pageCount < maxPages) {
        await delay(2000);
      }

    } while (nextPageToken && pageCount < maxPages);

    const places = allPlaces.slice(0, 50); // 최대 50개로 제한
    let savedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let detailsCallCount = 0;

    // 각 장소 처리
    for (const place of places) {
      const photoRef = place.photos && place.photos.length > 0
        ? place.photos[0].photo_reference
        : null;

      const imageUrl = photoRef ? getPhotoUrl(photoRef) : null;
      const tags = place.types ? JSON.stringify(place.types) : null;

      // 이미 존재하는지 확인
      const existing = await query(
        'SELECT * FROM placeInfo WHERE placeID = ?',
        [place.place_id]
      );

      // Details API 호출 여부 결정
      let koreanName = place.name; // 기본값: Nearby Search 이름
      let phoneNumber = null;
      let website = null;
      let description = null;
      let shouldCallDetailsAPI = false;

      if (existing.length > 0) {
        // 기존 데이터가 있는 경우
        const lastApiUpdate = existing[0].api_updated_at;

        if (!lastApiUpdate) {
          // api_updated_at이 NULL이면 한 번도 Details API를 호출 안 함
          shouldCallDetailsAPI = true;
        } else {
          // 마지막 호출로부터 30일 이상 지났는지 확인
          const daysSince = (Date.now() - new Date(lastApiUpdate)) / (1000 * 60 * 60 * 24);
          shouldCallDetailsAPI = daysSince >= 30;
        }

        // Details API 안 부르면 기존 값 유지
        if (!shouldCallDetailsAPI) {
          koreanName = existing[0].name;
          phoneNumber = existing[0].phoneNumber;
          website = existing[0].website;
          description = existing[0].description;
        }
      } else {
        // 새로운 장소면 무조건 Details API 호출
        shouldCallDetailsAPI = true;
      }

      // 영업시간 데이터
      let openingHoursData = null;

      // Details API 호출 (필요한 경우만)
      if (shouldCallDetailsAPI) {
        try {
          const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
              place_id: place.place_id,
              fields: 'name,formatted_phone_number,website,editorial_summary,opening_hours',
              key: process.env.GOOGLE_PLACES_API_KEY,
              language: 'ko'
            }
          });

          if (detailsResponse.data.status === 'OK') {
            const details = detailsResponse.data.result;
            koreanName = details.name || place.name; // 한국어 이름 우선
            phoneNumber = details.formatted_phone_number || null;
            website = details.website || null;
            description = details.editorial_summary?.overview || null;

            // 한국어가 아니면 번역
            if (koreanName && !/[가-힣]/.test(koreanName)) {
              const translated = await translator.autoTranslate(koreanName);
              console.log(`      🌐 이름 번역: ${koreanName} → ${translated}`);
              koreanName = translated;
            }

            if (description && !/[가-힣]/.test(description)) {
              const translated = await translator.autoTranslate(description);
              console.log(`      🌐 설명 번역: ${description.substring(0, 30)}... → ${translated.substring(0, 30)}...`);
              description = translated;
            }

            // 영업시간 파싱
            if (details.opening_hours) {
              openingHoursData = transformOpeningHours(details.opening_hours);
            }
          }

          detailsCallCount++;

          // API 호출 간격 (Details API)
          await delay(100);

        } catch (err) {
          // Details API 실패해도 계속 진행
          console.log(`    ⚠️  Details API 실패: ${place.name}`);
        }
      }

      if (existing.length > 0) {
        // UPDATE
        try {
          await query(
            `UPDATE placeInfo SET
             name = ?, imageReference = ?, rating = ?, ratingCount = ?,
             address = ?, latitude = ?, longitude = ?, placeMainType = ?,
             phoneNumber = ?, website = ?, description = ?, tags = ?,
             api_updated_at = ${shouldCallDetailsAPI ? 'NOW()' : 'api_updated_at'}
             WHERE placeID = ?`,
            [
              koreanName,
              imageUrl,
              place.rating || 0,
              place.user_ratings_total || 0,
              place.vicinity,
              place.geometry.location.lat,
              place.geometry.location.lng,
              place.types ? place.types[0] : null,
              phoneNumber,
              website,
              description,
              tags,
              place.place_id
            ]
          );

          updatedCount++;

          // 영업시간 저장 (UPDATE 후)
          if (openingHoursData) {
            try {
              await query(
                `INSERT INTO placeopeninginfo (placeID, openingHours)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE openingHours = ?`,
                [place.place_id, JSON.stringify(openingHoursData), JSON.stringify(openingHoursData)]
              );
            } catch (err) {
              console.log(`    ⚠️  영업시간 저장 실패: ${err.message}`);
            }
          }

        } catch (err) {
          console.log(`    ❌ UPDATE 실패: ${koreanName} - ${err.message}`);
        }
      } else {
        // INSERT
        try {
          await query(
            `INSERT INTO placeInfo
             (placeID, name, imageReference, rating, ratingCount,
              address, latitude, longitude, placeMainType,
              phoneNumber, website, description, tags, api_updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              place.place_id,
              koreanName,
              imageUrl,
              place.rating || 0,
              place.user_ratings_total || 0,
              place.vicinity,
              place.geometry.location.lat,
              place.geometry.location.lng,
              place.types ? place.types[0] : null,
              phoneNumber,
              website,
              description,
              tags
            ]
          );

          // stationNearByInfo에도 저장 (중복 체크)
          const nearbyExists = await query(
            'SELECT * FROM stationNearByInfo WHERE placeID = ? AND stationGroupCode = ?',
            [place.place_id, station.stationGroupCode]
          );

          if (nearbyExists.length === 0) {
            await query(
              `INSERT INTO stationNearByInfo
               (placeID, stationGroupCode, distanceFromStation)
               VALUES (?, ?, 500)`,
              [place.place_id, station.stationGroupCode]
            );
          }

          savedCount++;

          // 영업시간 저장 (INSERT 후)
          if (openingHoursData) {
            try {
              await query(
                `INSERT INTO placeopeninginfo (placeID, openingHours)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE openingHours = ?`,
                [place.place_id, JSON.stringify(openingHoursData), JSON.stringify(openingHoursData)]
              );
            } catch (err) {
              console.log(`    ⚠️  영업시간 저장 실패: ${err.message}`);
            }
          }

        } catch (err) {
          console.log(`    ❌ INSERT 실패: ${koreanName} - ${err.message}`);
        }
      }
    }

    return {
      saved: savedCount,
      updated: updatedCount,
      skipped: skippedCount,
      total: places.length,
      detailsCalls: detailsCallCount,
      apiCalls: pageCount
    };

  } catch (error) {
    console.log(`  ❌ ${station.stationNameJa} - 에러: ${error.message}`);
    return { saved: 0, updated: 0, skipped: 0, total: 0, detailsCalls: 0, apiCalls: 0 };
  }
};

const syncAllPlaces = async () => {
  try {
    // 모든 역 가져오기 (마루노우치선 + 히비야선)
    console.log('📍 역 목록 조회 중...');
    const stations = await query(
      `SELECT s.*, b.stationCode, l.lineNameJa
       FROM stationInfo s
       JOIN stationByLineInfo b ON s.stationGroupCode = b.stationGroupCode
       JOIN lineInfo l ON b.lineCode = l.lineCode
       WHERE b.lineCode IN ('M', 'H')
       ORDER BY b.lineCode, b.stationCode`
    );

    console.log(`✅ 총 ${stations.length}개 역 찾음`);
    console.log('');

    // 확인 메시지
    console.log('⚠️  주의사항:');
    console.log(`   - 총 ${stations.length}개 역 처리`);
    console.log(`   - 역당 최대 50개 장소 수집 (페이지네이션 사용)`);
    console.log(`   - 예상 소요 시간: 약 ${Math.ceil(stations.length * 8 / 60)}분`);
    console.log(`   - Nearby Search 예상 비용: $${(stations.length * 3 * 0.032).toFixed(2)} (최대 ${stations.length * 3}회)`);
    console.log(`   - Details API는 필요한 경우만 호출 (30일 기준)`);
    console.log('');
    console.log('시작하려면 10초 기다립니다...');
    console.log('(중단하려면 Ctrl+C)');
    console.log('');

    // 10초 카운트다운
    for (let i = 10; i > 0; i--) {
      process.stdout.write(`${i}... `);
      await delay(1000);
    }
    console.log('시작!\n');

    // 진행 상황 추적
    let totalSaved = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let totalPlaces = 0;
    let totalDetailsCalls = 0;
    let totalApiCalls = 0;
    let currentLine = '';

    // 각 역마다 처리
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];

      // 노선 변경 시 헤더 출력
      if (currentLine !== station.lineNameJa) {
        currentLine = station.lineNameJa;
        console.log('');
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📍 ${currentLine}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      }

      // 진행 상황
      process.stdout.write(`[${i+1}/${stations.length}] ${station.stationNameJa} (${station.stationCode})... `);

      // 장소 수집
      const result = await syncPlacesForStation(station);

      totalSaved += result.saved;
      totalUpdated += result.updated;
      totalSkipped += result.skipped;
      totalPlaces += result.total;
      totalDetailsCalls += result.detailsCalls;
      totalApiCalls += result.apiCalls;

      console.log(`✓ ${result.total}개 수집 / 저장 ${result.saved}개 / 업데이트 ${result.updated}개 / API ${result.apiCalls}회`);

      // API 호출 간격 (1초)
      if (i < stations.length - 1) {
        await delay(1000);
      }
    }

    // 최종 결과
    console.log('');
    console.log('========================================');
    console.log('📊 최종 결과');
    console.log('========================================');
    console.log(`처리한 역: ${stations.length}개`);
    console.log(`찾은 장소: ${totalPlaces}개 (평균 ${Math.round(totalPlaces/stations.length)}개/역)`);
    console.log(`새로 저장: ${totalSaved}개`);
    console.log(`업데이트: ${totalUpdated}개`);
    console.log('');
    console.log(`💰 실제 비용:`);
    console.log(`  - Nearby Search: $${(totalApiCalls * 0.032).toFixed(2)} (${totalApiCalls}회)`);
    console.log(`  - Place Details: $${(totalDetailsCalls * 0.017).toFixed(2)} (${totalDetailsCalls}회)`);
    console.log(`  - 총: $${(totalApiCalls * 0.032 + totalDetailsCalls * 0.017).toFixed(2)}`);
    console.log('');
    console.log('💡 최적화:');
    console.log(`  - Details API 절약: ${totalPlaces - totalDetailsCalls}회 (30일 이내 데이터 재사용)`);
    console.log(`  - 절약 금액: $${((totalPlaces - totalDetailsCalls) * 0.017).toFixed(2)}`);
    console.log('');

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
  }
};

// 메인 실행
const run = async () => {
  // API 키 확인
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY가 .env 파일에 없습니다!');
    process.exit(1);
  }

  await syncAllPlaces();

  console.log('✅ 완료!');
  console.log('');
  console.log('다음 확인 명령어:');
  console.log('  http://localhost:5000/api/places');
  console.log('  mysql> SELECT COUNT(*) FROM placeInfo;');
  console.log('  mysql> SELECT COUNT(*) FROM placeInfo WHERE api_updated_at IS NOT NULL;');
  console.log('');

  process.exit(0);
};

run();
