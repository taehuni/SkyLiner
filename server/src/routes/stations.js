const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// 모든 역 목록 조회
router.get('/', async (req, res) => {
  try {
    const { lineCode } = req.query;  // 특정 노선의 역만 조회

    let sql = `
      SELECT 
        s.*,
        sbl.stationCode,
        l.lineNameKo,
        l.lineNameJa,
        l.lineNameEn,
        l.color
      FROM stationInfo s
      LEFT JOIN stationByLineInfo sbl ON s.stationGroupCode = sbl.stationGroupCode
      LEFT JOIN lineInfo l ON sbl.lineCode = l.lineCode
    `;

    const params = [];

    if (lineCode) {
      sql += ` WHERE sbl.lineCode = ?`;
      params.push(lineCode);
    }

    sql += ` ORDER BY sbl.lineCode, s.stationGroupCode`;

    const stations = await query(sql, params);

    res.json({
      success: true,
      count: stations.length,
      data: stations.map(station => ({
        stationGroupCode: station.stationGroupCode,
        stationCode: station.stationCode,
        name: station.stationNameKo,
        nameJa: station.stationNameJa,
        nameEn: station.stationNameEn,
        lineCode: station.lineCode,
        lineName: station.lineNameKo || station.lineNameJa,
        lineColor: station.color,
        latitude: station.latitude,
        longitude: station.longitude
      }))
    });
  } catch (error) {
    console.error('Get Stations Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stations'
    });
  }
});

// stationCode로 역 정보 조회
router.get('/by-code/:stationCode', async (req, res) => {
  try {
    let { stationCode } = req.params;

    // 환승역인 경우 (예: H07_M15) 첫 번째 역 코드 사용하여 stationGroupCode 찾기
    const firstStationCode = stationCode.includes('_')
      ? stationCode.split('_')[0]
      : stationCode;

    // 먼저 stationGroupCode 찾기
    const stationGroupQuery = await query(
      `SELECT stationGroupCode FROM stationByLineInfo WHERE stationCode = ?`,
      [firstStationCode]
    );

    if (stationGroupQuery.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Station not found'
      });
    }

    const stationGroupCode = stationGroupQuery[0].stationGroupCode;

    // 해당 stationGroupCode의 모든 노선 정보 조회
    const sql = `
      SELECT
        s.*,
        sbl.stationCode,
        sbl.lineCode,
        sbl.stationOrder,
        l.lineNameKo,
        l.lineNameJa,
        l.lineNameEn,
        l.color
      FROM stationInfo s
      INNER JOIN stationByLineInfo sbl ON s.stationGroupCode = sbl.stationGroupCode
      INNER JOIN lineInfo l ON sbl.lineCode = l.lineCode
      WHERE s.stationGroupCode = ?
      ORDER BY sbl.lineCode
    `;

    const stations = await query(sql, [stationGroupCode]);

    if (stations.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Station not found'
      });
    }

    const station = stations[0];

    // 각 노선별 이전/다음 역 찾기
    const linesWithNav = await Promise.all(
      stations.map(async (s) => {
        let prevStationCode = null;
        let nextStationCode = null;

        if (s.stationOrder) {
          // 이전 역 (stationOrder - 1)
          const prevStation = await query(
            `SELECT stationCode FROM stationByLineInfo
             WHERE lineCode = ? AND stationOrder = ?`,
            [s.lineCode, s.stationOrder - 1]
          );
          if (prevStation.length > 0) {
            prevStationCode = prevStation[0].stationCode;
          }

          // 다음 역 (stationOrder + 1)
          const nextStation = await query(
            `SELECT stationCode FROM stationByLineInfo
             WHERE lineCode = ? AND stationOrder = ?`,
            [s.lineCode, s.stationOrder + 1]
          );
          if (nextStation.length > 0) {
            nextStationCode = nextStation[0].stationCode;
          }
        }

        return {
          stationCode: s.stationCode,
          lineCode: s.lineCode,
          lineName: s.lineNameKo || s.lineNameJa,
          lineColor: s.color,
          stationOrder: s.stationOrder,
          prevStationCode,
          nextStationCode
        };
      })
    );

    // 첫 번째 노선의 이전/다음 역 (하위 호환성)
    const prevStationCode = linesWithNav[0]?.prevStationCode || null;
    const nextStationCode = linesWithNav[0]?.nextStationCode || null;

    // 환승 가능한 노선 정보 (lineCode와 stationCode 포함)
    const connectingRailways = await query(
      `SELECT c.railwayName, l.lineCode, l.lineNameKo, l.lineNameJa, sbl.stationCode
       FROM connectingRailwayInfo c
       LEFT JOIN lineInfo l ON c.railwayName = l.odptId
       LEFT JOIN stationByLineInfo sbl ON c.stationGroupCode = sbl.stationGroupCode AND l.lineCode = sbl.lineCode
       WHERE c.stationGroupCode = ?`,
      [station.stationGroupCode]
    );

    // 여러 노선이 있는 경우 모든 노선 정보 반환 (이전/다음 역 포함)
    const allLines = linesWithNav;

    res.json({
      success: true,
      data: {
        stationGroupCode: station.stationGroupCode,
        stationCode: station.stationCode,
        name: station.stationNameKo,
        nameJa: station.stationNameJa,
        nameEn: station.stationNameEn,
        lineCode: station.lineCode,
        lineName: station.lineNameKo || station.lineNameJa,
        lineColor: station.color,
        latitude: station.latitude,
        longitude: station.longitude,
        exitInfo: station.exitInfo ? JSON.parse(station.exitInfo) : [],
        // 모든 노선 정보 (환승역/분기선용)
        allLines: allLines,
        connectingRailways: connectingRailways.map(r => ({
          railwayName: r.railwayName,
          lineCode: r.lineCode,
          lineName: r.lineNameKo || r.lineNameJa,
          stationCode: r.stationCode
        })),
        prevStationCode,
        nextStationCode
      }
    });
  } catch (error) {
    console.error('Get Station by Code Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch station by code'
    });
  }
});

// 특정 역 상세 정보
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        s.*,
        sbl.stationCode,
        l.lineNameKo,
        l.lineNameJa,
        l.lineNameEn,
        l.color
      FROM stationInfo s
      LEFT JOIN stationByLineInfo sbl ON s.stationGroupCode = sbl.stationGroupCode
      LEFT JOIN lineInfo l ON sbl.lineCode = l.lineCode
      WHERE s.stationGroupCode = ?
    `;

    const stations = await query(sql, [id]);

    if (stations.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Station not found'
      });
    }

    const station = stations[0];

    // 환승 가능한 노선 정보
    const connectingRailways = await query(
      `SELECT railwayName FROM connectingRailwayInfo WHERE stationGroupCode = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        stationGroupCode: station.stationGroupCode,
        stationCode: station.stationCode,
        name: station.stationNameKo,
        nameJa: station.stationNameJa,
        nameEn: station.stationNameEn,
        lineCode: station.lineCode,
        lineName: station.lineNameKo || station.lineNameJa,
        lineColor: station.color,
        latitude: station.latitude,
        longitude: station.longitude,
        exitInfo: station.exitInfo ? JSON.parse(station.exitInfo) : [],
        connectingRailways: connectingRailways.map(r => r.railwayName)
      }
    });
  } catch (error) {
    console.error('Get Station Detail Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch station details'
    });
  }
});

// 특정 역 주변 장소 조회
router.get('/:id/places', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    const sql = `
      SELECT 
        p.*,
        n.distanceFromStation
      FROM placeInfo p
      INNER JOIN stationNearByInfo n ON p.placeID = n.placeID
      WHERE n.stationGroupCode = ?
      ORDER BY p.rating DESC, p.ratingCount DESC
      LIMIT ?
    `;

    const places = await query(sql, [id, parseInt(limit)]);

    res.json({
      success: true,
      count: places.length,
      data: places.map(place => ({
        id: place.placeID,
        placeName: place.name,
        imageUrl: place.imageReference,
        rating: place.rating,
        ratingCount: place.ratingCount,
        stationDistance: place.distanceFromStation ? `${place.distanceFromStation}m` : null,
        address: place.address
      }))
    });
  } catch (error) {
    console.error('Get Station Places Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch places near station'
    });
  }
});

// 특정 역 날씨 정보
router.get('/:id/weather', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT *
      FROM weatherInfo
      WHERE stationGroupCode = ?
      ORDER BY time DESC
      LIMIT 1
    `;

    const weather = await query(sql, [id]);

    if (weather.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Weather information not found'
      });
    }

    res.json({
      success: true,
      data: {
        stationGroupCode: weather[0].stationGroupCode,
        time: weather[0].time,
        weatherStatus: weather[0].weatherStatus,
        temperature: weather[0].temp,
        tempFeel: weather[0].tempFeel,
        humidity: weather[0].humidity,
        cloud: weather[0].cloud,
        rainFall: weather[0].rainFall,
        snowFall: weather[0].snowFall
      }
    });
  } catch (error) {
    console.error('Get Weather Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather information'
    });
  }
});

// 노선 목록 조회
router.get('/lines/all', async (req, res) => {
  try {
    const sql = `
      SELECT 
        lineCode,
        lineNameKo,
        lineNameJa,
        lineNameEn,
        color,
        operator,
        stationNumber
      FROM lineInfo
      ORDER BY lineCode
    `;

    const lines = await query(sql);

    res.json({
      success: true,
      count: lines.length,
      data: lines.map(line => ({
        lineCode: line.lineCode,
        name: line.lineNameKo,
        nameJa: line.lineNameJa,
        nameEn: line.lineNameEn,
        color: line.color,
        operator: line.operator,
        stationNumber: line.stationNumber
      }))
    });
  } catch (error) {
    console.error('Get Lines Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lines'
    });
  }
});

// 환승 정보 조회
router.get('/:id/transfers', async (req, res) => {
  try {
    const { id } = req.params;

    // 해당 역의 역 코드 조회
    const stationCodes = await query(
      `SELECT stationCode FROM stationByLineInfo WHERE stationGroupCode = ?`,
      [id]
    );

    if (stationCodes.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const codes = stationCodes.map(s => s.stationCode);
    const placeholders = codes.map(() => '?').join(',');

    const sql = `
      SELECT 
        t.*,
        s1.stationCode as fromCode,
        s2.stationCode as toCode,
        si1.stationNameKo as fromStationName,
        si2.stationNameKo as toStationName
      FROM transferInfo t
      INNER JOIN stationByLineInfo s1 ON t.fromStationCode = s1.stationCode
      INNER JOIN stationByLineInfo s2 ON t.toStationCode = s2.stationCode
      INNER JOIN stationInfo si1 ON s1.stationGroupCode = si1.stationGroupCode
      INNER JOIN stationInfo si2 ON s2.stationGroupCode = si2.stationGroupCode
      WHERE t.fromStationCode IN (${placeholders})
    `;

    const transfers = await query(sql, codes);

    res.json({
      success: true,
      count: transfers.length,
      data: transfers.map(transfer => ({
        from: transfer.fromStationName,
        to: transfer.toStationName,
        travelTime: transfer.travelTime
      }))
    });
  } catch (error) {
    console.error('Get Transfers Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transfer information'
    });
  }
});

module.exports = router;