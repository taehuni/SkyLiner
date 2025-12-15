// const cron = require('node-cron');
// const { query } = require('../config/database');
// const { 
//   getRailways, 
//   getStations, 
//   transformStationData, 
//   transformRailwayData 
// } = require('../services/odptAPI');
// const { 
//   searchNearbyPlaces, 
//   getPlaceDetails,
//   transformPlaceData 
// } = require('../services/googlePlaces');

// // 동기화 로그 기록
// const logSync = async (syncType, status, recordsProcessed = 0, errorMessage = null) => {
//   try {
//     await query(
//       `INSERT INTO sync_logs (sync_type, status, records_processed, error_message, completed_at) 
//        VALUES (?, ?, ?, ?, NOW())`,
//       [syncType, status, recordsProcessed, errorMessage]
//     );
//   } catch (error) {
//     console.error('Failed to log sync:', error);
//   }
// };

// // 노선 데이터 동기화
// const syncRailways = async () => {
//   console.log('🚆 Starting railways sync...');
  
//   try {
//     const railways = await getRailways();
//     let count = 0;

//     for (const railway of railways) {
//       const data = transformRailwayData(railway);
      
//       await query(
//         `INSERT INTO lineInfo (lineCode, lineNameJa, lineNameEn, color, operator, odptId)
//          VALUES (?, ?, ?, ?, ?, ?)
//          ON DUPLICATE KEY UPDATE
//          lineNameJa = VALUES(lineNameJa),
//          lineNameEn = VALUES(lineNameEn),
//          color = VALUES(color),
//          operator = VALUES(operator)`,
//         [
//           data.line_code || data.odpt_id.split(':').pop(),
//           data.name,
//           data.name_en,
//           data.color,
//           data.operator,
//           data.odpt_id
//         ]
//       );
      
//       count++;
//     }

//     await logSync('lines', 'success', count);
//     console.log(`✅ Railways sync completed: ${count} records`);
//     return count;
//   } catch (error) {
//     console.error('❌ Railways sync failed:', error);
//     await logSync('lines', 'failed', 0, error.message);
//     throw error;
//   }
// };

// // 역 데이터 동기화
// const syncStations = async () => {
//   console.log('🚉 Starting stations sync...');
  
//   try {
//     const stations = await getStations();
//     let count = 0;

//     for (const station of stations) {
//       const data = transformStationData(station);
      
//       // 먼저 stationInfo에 역 정보 저장
//       const result = await query(
//         `INSERT INTO stationInfo (stationNameJa, stationNameEn, latitude, longitude, odptId, exitInfo)
//          VALUES (?, ?, ?, ?, ?, ?)
//          ON DUPLICATE KEY UPDATE
//          stationNameJa = VALUES(stationNameJa),
//          stationNameEn = VALUES(stationNameEn),
//          latitude = VALUES(latitude),
//          longitude = VALUES(longitude),
//          exitInfo = VALUES(exitInfo)`,
//         [
//           data.name,
//           data.name_en,
//           data.latitude,
//           data.longitude,
//           data.odpt_id,
//           data.exit_info
//         ]
//       );

//       // stationGroupCode 가져오기
//       const stationGroup = await query(
//         'SELECT stationGroupCode FROM stationInfo WHERE odptId = ?',
//         [data.odpt_id]
//       );

//       if (stationGroup.length > 0 && data.station_code) {
//         // stationByLineInfo에 노선별 역 정보 저장
//         await query(
//           `INSERT INTO stationByLineInfo (stationCode, stationGroupCode, lineCode)
//            VALUES (?, ?, ?)
//            ON DUPLICATE KEY UPDATE
//            stationGroupCode = VALUES(stationGroupCode),
//            lineCode = VALUES(lineCode)`,
//           [
//             data.station_code,
//             stationGroup[0].stationGroupCode,
//             data.line_id
//           ]
//         );
//       }
      
//       count++;
//     }

//     await logSync('stations', 'success', count);
//     console.log(`✅ Stations sync completed: ${count} records`);
//     return count;
//   } catch (error) {
//     console.error('❌ Stations sync failed:', error);
//     await logSync('stations', 'failed', 0, error.message);
//     throw error;
//   }
// };

// // 장소 데이터 동기화 (특정 역 주변)
// const syncPlacesNearStation = async (stationGroupCode) => {
//   try {
//     const stations = await query(
//       'SELECT * FROM stationInfo WHERE stationGroupCode = ?',
//       [stationGroupCode]
//     );
    
//     if (stations.length === 0) {
//       throw new Error('Station not found');
//     }
    
//     const station = stations[0];
    
//     // Google Places API로 주변 장소 검색
//     const places = await searchNearbyPlaces(
//       station.latitude, 
//       station.longitude, 
//       1000,  // 1km 반경
//       'tourist_attraction|restaurant|cafe'
//     );
    
//     let count = 0;
    
//     for (const place of places.slice(0, 20)) {  // 상위 20개만
//       const photoUrl = place.photos && place.photos.length > 0 
//         ? place.photos[0].photo_reference 
//         : null;
      
//       // placeInfo에 장소 정보 저장
//       await query(
//         `INSERT INTO placeInfo (placeID, name, imageReference, rating, ratingCount, address, latitude, longitude, placeMainType)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//          ON DUPLICATE KEY UPDATE
//          name = VALUES(name),
//          rating = VALUES(rating),
//          ratingCount = VALUES(ratingCount),
//          address = VALUES(address)`,
//         [
//           place.place_id,
//           place.name,
//           photoUrl,
//           place.rating || 0,
//           place.user_ratings_total || 0,
//           place.vicinity || place.formatted_address,
//           place.geometry?.location?.lat,
//           place.geometry?.location?.lng,
//           place.types ? place.types[0] : null
//         ]
//       );

//       // 거리 계산 (간단한 유클리드 거리)
//       const distance = Math.sqrt(
//         Math.pow((place.geometry?.location?.lat - station.latitude) * 111000, 2) +
//         Math.pow((place.geometry?.location?.lng - station.longitude) * 111000, 2)
//       );

//       // stationNearByInfo에 역-장소 관계 저장
//       await query(
//         `INSERT INTO stationNearByInfo (placeID, stationGroupCode, distanceFromStation)
//          VALUES (?, ?, ?)
//          ON DUPLICATE KEY UPDATE
//          distanceFromStation = VALUES(distanceFromStation)`,
//         [
//           place.place_id,
//           stationGroupCode,
//           Math.round(distance)
//         ]
//       );
      
//       count++;
//     }
    
//     return count;
//   } catch (error) {
//     console.error(`Failed to sync places for station ${stationGroupCode}:`, error);
//     throw error;
//   }
// };

// // 모든 역의 주변 장소 동기화
// const syncAllPlaces = async () => {
//   console.log('📍 Starting places sync...');
  
//   try {
//     const stations = await query('SELECT stationGroupCode FROM stationInfo LIMIT 10');  // 테스트용으로 10개만
//     let totalCount = 0;
    
//     for (const station of stations) {
//       const count = await syncPlacesNearStation(station.stationGroupCode);
//       totalCount += count;
      
//       // API 요청 제한 고려하여 딜레이
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     }
    
//     await logSync('places', 'success', totalCount);
//     console.log(`✅ Places sync completed: ${totalCount} records`);
//     return totalCount;
//   } catch (error) {
//     console.error('❌ Places sync failed:', error);
//     await logSync('places', 'failed', 0, error.message);
//     throw error;
//   }
// };

// // 전체 동기화 실행
// const runFullSync = async () => {
//   console.log('========================================');
//   console.log('🔄 Starting full data synchronization');
//   console.log('========================================');
  
//   try {
//     await syncRailways();
//     await syncStations();
//     await syncAllPlaces();
    
//     console.log('========================================');
//     console.log('✅ Full synchronization completed');
//     console.log('========================================');
//   } catch (error) {
//     console.error('Full sync failed:', error);
//   }
// };

// // Cron 스케줄 설정
// const setupSchedule = () => {
//   const schedule = process.env.DATA_SYNC_SCHEDULE || '0 */6 * * *';
  
//   console.log(`📅 Data sync scheduled: ${schedule}`);
  
//   cron.schedule(schedule, () => {
//     console.log('Scheduled sync triggered');
//     runFullSync();
//   });
// };

// module.exports = {
//   syncRailways,
//   syncStations,
//   syncPlacesNearStation,
//   syncAllPlaces,
//   runFullSync,
//   setupSchedule
// };