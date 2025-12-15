// // ODPT API에서 열차 정보 수집
// const db = require('../config/database');
// const axios = require('axios');
// require('dotenv').config();

// const ODPT_API_KEY = process.env.ODPT_API_KEY || 'your_api_key_here';
// const BASE_URL = 'https://api.odpt.org/api/v4';

// // 딜레이 함수
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // 열차 종별 변환 (ODPT → 우리 형식)
// const parseTrainType = (odptTrainType) => {
//   if (!odptTrainType) return '普通'; // 기본값: 보통

//   // odpt.TrainType:TokyoMetro.Local → "普通"
//   const typeMap = {
//     'Local': '普通',
//     'Express': '急行',
//     'RapidExpress': '快速急行',
//     'Rapid': '快速',
//     'SemiExpress': '準急',
//     'LimitedExpress': '特急'
//   };

//   const match = odptTrainType.match(/TrainType:[^.]+\.(.+)$/);
//   if (match && typeMap[match[1]]) {
//     return typeMap[match[1]];
//   }

//   return '普通';
// };

// // 목적지 역명 추출 (ODPT → 역명)
// const parseDestinationStation = (odptDestination) => {
//   if (!odptDestination || odptDestination.length === 0) return null;

//   // odpt.Station:TokyoMetro.Marunouchi.Ikebukuro → "池袋"
//   // 배열의 첫 번째 항목 사용
//   const stationId = Array.isArray(odptDestination) ? odptDestination[0] : odptDestination;
//   const match = stationId.match(/Station:[^.]+\.[^.]+\.(.+)$/);

//   return match ? match[1] : null;
// };

// async function syncTrainInfo() {
//   try {
//     console.log('🚇 열차 정보 동기화 시작\n');

//     // 1. 모든 역 조회
//     console.log('1️⃣  역 목록 조회...\n');

//     const stations = await db.query(`
//       SELECT sbl.stationCode, sbl.lineCode, si.stationNameJa, sbl.odptId
//       FROM stationByLineInfo sbl
//       JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
//       WHERE sbl.lineCode IN ('M', 'H')
//       ORDER BY sbl.lineCode, sbl.stationCode
//     `);

//     console.log(`✅ 총 ${stations.length}개 역 발견\n`);

//     // 2. 기존 데이터 삭제
//     await db.query('DELETE FROM trainInfo');
//     console.log('🗑️  기존 열차 정보 삭제 완료\n');

//     // 3. 각 역의 시간표에서 열차 정보 추출
//     console.log('2️⃣  ODPT API에서 열차 정보 수집 중...\n');

//     let totalTrains = 0;
//     let currentLine = '';
//     const trainSet = new Set(); // 중복 제거용

//     for (let i = 0; i < stations.length; i++) {
//       const station = stations[i];

//       // 노선 변경 시 헤더 출력
//       if (currentLine !== station.lineCode) {
//         currentLine = station.lineCode;
//         console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
//         console.log(`📍 ${station.lineCode}선`);
//         console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
//       }

//       try {
//         console.log(`[${i + 1}/${stations.length}] ${station.stationNameJa} (${station.stationCode})`);

//         // ODPT StationTimetable API 호출
//         const railway = station.lineCode === 'M'
//           ? 'odpt.Railway:TokyoMetro.Marunouchi'
//           : 'odpt.Railway:TokyoMetro.Hibiya';

//         const response = await axios.get(`${BASE_URL}/odpt:StationTimetable`, {
//           params: {
//             'acl:consumerKey': ODPT_API_KEY,
//             'odpt:railway': railway,
//             'odpt:station': station.odptId
//           }
//         });

//         if (response.data.length === 0) {
//           console.log(`   ⚠️  시간표 데이터 없음\n`);
//           continue;
//         }

//         let stationTrainCount = 0;

//         // 각 방향의 시간표 처리
//         for (const timetable of response.data) {
//           const timetableObjects = timetable['odpt:stationTimetableObject'] || [];

//           for (const train of timetableObjects) {
//             const trainNumber = train['odpt:trainNumber'];
//             const trainType = train['odpt:trainType'];
//             const destination = train['odpt:destinationStation'];

//             if (!trainNumber) continue;

//             // 중복 체크
//             const trainKey = `${trainNumber}-${station.stationCode}`;
//             if (trainSet.has(trainKey)) continue;

//             trainSet.add(trainKey);

//             // 데이터 변환
//             const parsedTrainType = parseTrainType(trainType);
//             const parsedDestination = parseDestinationStation(destination);

//             // DB에 저장
//             await db.query(`
//               INSERT INTO trainInfo (trainCode, trainType, destinationStation, stationCode)
//               VALUES (?, ?, ?, ?)
//               ON DUPLICATE KEY UPDATE
//                 trainType = VALUES(trainType),
//                 destinationStation = VALUES(destinationStation)
//             `, [trainNumber, parsedTrainType, parsedDestination, station.stationCode]);

//             stationTrainCount++;
//           }
//         }

//         console.log(`   ✅ ${stationTrainCount}개 열차 저장\n`);
//         totalTrains += stationTrainCount;

//         // Rate limit 방지
//         await delay(300);

//       } catch (error) {
//         console.log(`   ❌ 에러: ${error.message}\n`);

//         if (error.response?.status === 429) {
//           console.log('   ⏳ Rate limit 감지, 2초 대기...\n');
//           await delay(2000);
//         }
//       }

//       // 10개마다 진행 상황 출력
//       if ((i + 1) % 10 === 0) {
//         console.log(`\n📊 진행 상황: ${i + 1}/${stations.length} (총 ${totalTrains}개 열차)\n`);
//       }
//     }

//     // 4. 최종 결과
//     console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
//     console.log('📊 동기화 완료\n');

//     const result = await db.query('SELECT COUNT(*) as cnt FROM trainInfo');
//     console.log(`✅ 총 ${result[0].cnt}개 열차 정보 저장`);

//     // 샘플 데이터 조회
//     console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
//     console.log('📋 저장된 데이터 샘플 (10개):\n');

//     const samples = await db.query(`
//       SELECT
//         ti.trainCode,
//         ti.trainType,
//         ti.destinationStation,
//         ti.stationCode,
//         si.stationNameJa
//       FROM trainInfo ti
//       JOIN stationByLineInfo sbl ON ti.stationCode = sbl.stationCode
//       JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
//       LIMIT 10
//     `);

//     samples.forEach((s, idx) => {
//       console.log(`${idx + 1}. 열차: ${s.trainCode}`);
//       console.log(`   종별: ${s.trainType}`);
//       console.log(`   행선지: ${s.destinationStation || '(없음)'}`);
//       console.log(`   정차역: ${s.stationNameJa} (${s.stationCode})\n`);
//     });

//     // 통계
//     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
//     console.log('📊 통계\n');

//     const typeStats = await db.query(`
//       SELECT trainType, COUNT(*) as cnt
//       FROM trainInfo
//       GROUP BY trainType
//       ORDER BY cnt DESC
//     `);

//     console.log('열차 종별 분포:');
//     typeStats.forEach(s => {
//       console.log(`   ${s.trainType}: ${s.cnt}개`);
//     });

//     console.log('\n✅ trainInfo 동기화 완료!');

//   } catch (error) {
//     console.error('❌ Error:', error.message);
//     console.error(error.stack);
//   } finally {
//     process.exit(0);
//   }
// }

// syncTrainInfo();
