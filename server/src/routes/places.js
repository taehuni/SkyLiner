const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// 모든 장소 목록 조회
router.get('/', async (req, res) => {
  try {
    const { 
      stationGroupCode,
      limit = 20, 
      offset = 0 
    } = req.query;

    let sql = `
      SELECT 
        p.*,
        s.stationNameKo,
        s.stationNameJa,
        s.stationNameEn,
        n.distanceFromStation
      FROM placeInfo p
      LEFT JOIN stationNearByInfo n ON p.placeID = n.placeID
      LEFT JOIN stationInfo s ON n.stationGroupCode = s.stationGroupCode
    `;

    const params = [];

    if (stationGroupCode) {
      sql += ` WHERE n.stationGroupCode = ?`;
      params.push(parseInt(stationGroupCode));
    }

    sql += ` ORDER BY p.rating DESC, p.ratingCount DESC LIMIT ? OFFSET ?`;
    
    // 파라미터를 명시적으로 숫자로 변환
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    params.push(limitNum, offsetNum);

    console.log('SQL:', sql);
    console.log('Params:', params);

    const places = await query(sql, params);

    res.json({
      success: true,
      count: places.length,
      data: places.map(place => ({
        id: place.placeID,
        placeName: place.name,
        imageUrl: place.imageReference,
        rating: place.rating,
        ratingCount: place.ratingCount,
        stationName: place.stationNameKo || place.stationNameJa,
        stationDistance: place.distanceFromStation ? `${place.distanceFromStation}m` : null,
        address: place.address,
        description: place.description,
        placeType: place.placeMainType,
        tags: place.tags || []
      }))
    });
  } catch (error) {
    console.error('Get Places Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch places',
      message: error.message
    });
  }
});

// 장소 검색
router.get('/search', async (req, res) => {
  try {
    const { keyword, limit = 10 } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Keyword is required'
      });
    }

    const sql = `
      SELECT
        p.*,
        s.stationNameKo,
        s.stationNameJa
      FROM placeInfo p
      LEFT JOIN stationNearByInfo n ON p.placeID = n.placeID
      LEFT JOIN stationInfo s ON n.stationGroupCode = s.stationGroupCode
      WHERE p.name LIKE ? OR p.address LIKE ?
      ORDER BY p.rating DESC
      LIMIT ?
    `;

    const searchTerm = `%${keyword}%`;
    const limitNum = parseInt(limit) || 10;

    const places = await query(sql, [searchTerm, searchTerm, limitNum]);

    res.json({
      success: true,
      count: places.length,
      data: places.map(place => ({
        id: place.placeID,
        placeName: place.name,
        imageUrl: place.imageReference,
        stationName: place.stationNameKo || place.stationNameJa,
        rating: place.rating,
        address: place.address
      }))
    });
  } catch (error) {
    console.error('Search Places Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search places',
      message: error.message
    });
  }
});

// 특정 장소 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT
        p.*,
        po.openingHours,
        s.stationNameKo,
        s.stationNameJa,
        s.stationNameEn,
        n.distanceFromStation
      FROM placeInfo p
      LEFT JOIN placeOpeningInfo po ON p.placeID = po.placeID
      LEFT JOIN stationNearByInfo n ON p.placeID = n.placeID
      LEFT JOIN stationInfo s ON n.stationGroupCode = s.stationGroupCode
      WHERE p.placeID = ?
    `;

    const places = await query(sql, [id]);

    if (places.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Place not found'
      });
    }

    const place = places[0];

    res.json({
      success: true,
      data: {
        id: place.placeID,
        placeName: place.name,
        imageUrl: place.imageReference,
        rating: place.rating,
        ratingCount: place.ratingCount,
        stationName: place.stationNameKo || place.stationNameJa,
        stationDistance: place.distanceFromStation ? `${place.distanceFromStation}m` : null,
        address: place.address,
        phoneNumber: place.phoneNumber,
        website: place.website,
        description: place.description,
        placeType: place.placeMainType,
        tags: place.tags || [],
        openingHours: place.openingHours || null
      }
    });
  } catch (error) {
    console.error('Get Place Detail Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch place details',
      message: error.message
    });
  }
});

module.exports = router;