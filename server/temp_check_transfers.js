const db = require('./src/config/database');

(async () => {
  try {
    const transfers = await db.query(`
      SELECT DISTINCT si.stationNameKo, si.stationNameJa, sbl.stationCode, sbl.lineCode
      FROM stationInfo si
      JOIN stationByLineInfo sbl ON si.stationGroupCode = sbl.stationGroupCode
      WHERE si.stationGroupCode IN (
        SELECT stationGroupCode FROM stationByLineInfo WHERE lineCode = "H"
      )
      AND sbl.lineCode != "H"
      ORDER BY si.stationNameKo, sbl.lineCode
    `);

    console.log('=== 히비야선 환승역 ===');
    let currentStation = '';
    transfers.forEach(t => {
      if (currentStation !== t.stationNameKo) {
        if (currentStation) console.log('');
        currentStation = t.stationNameKo;
        console.log(`${t.stationNameKo} (${t.stationNameJa}):`);
      }
      console.log(`  → ${t.lineCode}선 (${t.stationCode})`);
    });

  } catch (error) {
    console.error('에러:', error.message);
  } finally {
    await db.pool.end();
  }
})();
