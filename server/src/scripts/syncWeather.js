// Open-Meteo API를 사용한 날씨 데이터 수집
require('dotenv').config();
const { query } = require('../config/database');
const axios = require('axios');

console.log('========================================');
console.log('🌤️  날씨 데이터 수집 (Open-Meteo API)');
console.log('========================================');
console.log('');

// 딜레이 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Open-Meteo 날씨 코드를 우리 enum으로 변환
const getWeatherStatus = (weatherCode) => {
  // WMO Weather interpretation codes
  // 0: Clear sky
  // 1-3: Mainly clear, partly cloudy, overcast
  // 45-48: Fog
  // 51-67: Rain (drizzle, rain, freezing rain)
  // 71-77, 85-86: Snow
  // 80-82: Rain showers
  // 95-99: Thunderstorm

  if (weatherCode === 0 || weatherCode === 1) return 'sunny';
  if (weatherCode >= 2 && weatherCode <= 3) return 'cloudy';
  if (weatherCode >= 45 && weatherCode <= 48) return 'cloudy';
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || (weatherCode >= 95 && weatherCode <= 99)) return 'rainy';
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) return 'snowy';

  return 'cloudy'; // 기본값
};

async function syncWeather() {
  try {
    console.log('📍 역 목록 조회 중...\n');
11
    // 모든 역 조회
    const stations = await query(`
      SELECT stationGroupCode, stationNameKo, stationNameJa, latitude, longitude
      FROM stationInfo
      ORDER BY stationGroupCode
    `);

    console.log(`✅ 총 ${stations.length}개 역 찾음\n`);

    let successCount = 0;
    let errorCount = 0;

    // 각 역의 날씨 수집
    for (const station of stations) {
      try {
        console.log(`[${successCount + errorCount + 1}/${stations.length}] ${station.stationNameJa} (${station.stationNameKo})...`);

        // Open-Meteo API 호출
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: station.latitude,
            longitude: station.longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,snowfall,cloud_cover,weather_code',
            timezone: 'Asia/Tokyo'
          }
        });

        const current = response.data.current;

        // 날씨 상태 변환
        const weatherStatus = getWeatherStatus(current.weather_code);

        // DB에 저장 (기존 데이터 삭제 후 삽입)
        await query(
          'DELETE FROM weatherinfo WHERE stationGroupCode = ?',
          [station.stationGroupCode]
        );

        await query(
          `INSERT INTO weatherinfo
           (stationGroupCode, time, weatherStatus, temp, tempFeel, humidity, cloud, rainFall, snowFall)
           VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)`,
          [
            station.stationGroupCode,
            weatherStatus,
            current.temperature_2m || 0,
            current.apparent_temperature || 0,
            current.relative_humidity_2m || 0,
            current.cloud_cover || 0,
            current.precipitation || 0,
            current.snowfall || 0
          ]
        );

        console.log(`  ✓ ${weatherStatus} ${Math.round(current.temperature_2m)}°C 습도${current.relative_humidity_2m}%`);

        successCount++;

        // API 호출 간격 (무료 API이므로 조금 여유있게)
        await delay(200);

      } catch (err) {
        console.log(`  ❌ 실패: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n========================================');
    console.log('📊 최종 결과');
    console.log('========================================');
    console.log(`성공: ${successCount}개`);
    console.log(`실패: ${errorCount}개`);
    console.log(`총: ${stations.length}개`);
    console.log('\n✅ 완료!');
    console.log('\n다음 확인 명령어:');
    console.log('  http://localhost:5000/api/stations/1/weather');
    console.log('  mysql> SELECT * FROM weatherinfo LIMIT 5;');

    process.exit(0);

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    process.exit(1);
  }
}

// 실행
syncWeather();
