// 날씨 서비스 - Open-Meteo API
const { query } = require('../config/database');
const axios = require('axios');

// Open-Meteo 날씨 코드를 우리 enum으로 변환
const getWeatherStatus = (weatherCode) => {
  if (weatherCode === 0 || weatherCode === 1) return 'sunny';
  if (weatherCode >= 2 && weatherCode <= 3) return 'cloudy';
  if (weatherCode >= 45 && weatherCode <= 48) return 'cloudy';
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || (weatherCode >= 95 && weatherCode <= 99)) return 'rainy';
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) return 'snowy';
  return 'cloudy';
};

// 날씨 데이터 업데이트
async function updateWeather() {
  try {
    console.log('[Weather] 날씨 업데이트 시작...');

    // 모든 역 조회
    const stations = await query(`
      SELECT stationGroupCode, stationNameKo, latitude, longitude
      FROM stationInfo
    `);

    let successCount = 0;
    let errorCount = 0;

    // 각 역의 날씨 수집
    for (const station of stations) {
      try {
        // Open-Meteo API 호출
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: station.latitude,
            longitude: station.longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,snowfall,cloud_cover,weather_code',
            timezone: 'Asia/Tokyo'
          },
          timeout: 5000
        });

        const current = response.data.current;
        const weatherStatus = getWeatherStatus(current.weather_code);

        // DB에 저장
        await query('DELETE FROM weatherinfo WHERE stationGroupCode = ?', [station.stationGroupCode]);
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

        successCount++;

        // API 호출 간격
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        console.error(`[Weather] ${station.stationNameKo} 실패:`, err.message);
        errorCount++;
      }
    }

    console.log(`[Weather] 완료: 성공 ${successCount}, 실패 ${errorCount}`);
    return { success: successCount, error: errorCount };

  } catch (error) {
    console.error('[Weather] 업데이트 에러:', error.message);
    throw error;
  }
}

module.exports = { updateWeather };
