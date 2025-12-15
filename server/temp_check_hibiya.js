const db = require('./src/config/database');

(async () => {
  try {
    console.log('=== 히비야선 전체 역 목록 ===');
    const stations = await db.query(`
      SELECT sbl.stationCode, si.stationNameKo, si.stationNameJa, sbl.odptId
      FROM stationByLineInfo sbl
      JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
      WHERE sbl.lineCode = "H"
      ORDER BY sbl.stationCode
    `);

    stations.forEach(s => console.log(`${s.stationCode}: ${s.stationNameKo} (${s.stationNameJa})`));

    console.log('\n=== 시간표 목적지 종류 ===');
    const destinations = await db.query(`
      SELECT DISTINCT destinationStation
      FROM stationTimeInfo
      WHERE stationCode LIKE "H%"
      ORDER BY destinationStation
    `);

    console.log('목적지:', destinations.map(t => t.destinationStation).join(', '));

    console.log('\n=== 목적지별 매칭 결과 ===');
    for (const dest of destinations) {
      const match = await db.query(
        'SELECT stationCode, si.stationNameKo FROM stationByLineInfo sbl JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode WHERE sbl.stationCode = ?',
        [dest.destinationStation]
      );

      if (match.length > 0) {
        console.log(`✅ ${dest.destinationStation} → ${match[0].stationNameKo}`);
      } else {
        console.log(`❌ ${dest.destinationStation} → DB에 없음 (외부 노선)`);
      }
    }

  } catch (error) {
    console.error('에러:', error.message);
  } finally {
    await db.pool.end();
  }
})();
