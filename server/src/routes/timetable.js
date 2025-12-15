// 시간표 API
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/timetable/:stationCode?calendarType=weekday&direction=forward&time=08:00
router.get('/:stationCode', async (req, res) => {
  try {
    const { stationCode } = req.params;
    const {
      calendarType = 'weekday',
      direction,
      time,
      limit = 10
    } = req.query;

    // 파라미터 검증
    if (!stationCode) {
      return res.status(400).json({
        success: false,
        error: 'stationCode가 필요합니다'
      });
    }

    if (!['weekday', 'holiday'].includes(calendarType)) {
      return res.status(400).json({
        success: false,
        error: 'calendarType은 weekday 또는 holiday여야 합니다'
      });
    }

    // 쿼리 구성 (destinationStation의 한국어/일본어 이름 JOIN)
    let query = `
      SELECT
        sti.departureTime,
        sti.trainCode,
        sti.trainType,
        sti.destinationStation,
        MAX(si.stationNameKo) as destinationNameKo,
        MAX(si.stationNameJa) as destinationNameJa,
        sti.railDirection,
        sti.calendarType
      FROM stationTimeInfo sti
      LEFT JOIN stationByLineInfo sbl ON sti.destinationStation = sbl.stationCode
      LEFT JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
      WHERE sti.stationCode = ? AND sti.calendarType = ?
    `;
    const params = [stationCode, calendarType];

    // 방향 필터
    if (direction) {
      query += ' AND sti.railDirection = ?';
      params.push(direction);
    }

    // 시간 필터 (현재 시각 이후)
    if (time) {
      query += ' AND sti.departureTime >= ?';
      params.push(time);
    }

    // GROUP BY로 중복 방지 (같은 stationCode가 여러 노선에 있을 경우)
    query += ' GROUP BY sti.departureTime, sti.trainCode, sti.trainType, sti.destinationStation, sti.railDirection, sti.calendarType';
    query += ' ORDER BY sti.departureTime LIMIT ?';
    params.push(parseInt(limit));

    const timetable = await db.query(query, params);

    if (timetable.length === 0) {
      return res.status(404).json({
        success: false,
        error: '시간표 데이터를 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      data: {
        stationCode,
        calendarType,
        direction: direction || 'all',
        count: timetable.length,
        timetable
      }
    });

  } catch (error) {
    console.error('시간표 조회 에러:', error);
    res.status(500).json({
      success: false,
      error: '시간표 조회 중 오류가 발생했습니다',
      message: error.message
    });
  }
});

// GET /api/timetable/:stationCode/next?calendarType=weekday&direction=forward&count=5
router.get('/:stationCode/next', async (req, res) => {
  try {
    const { stationCode } = req.params;
    const {
      calendarType = 'weekday',
      direction,
      count = 5
    } = req.query;

    // 현재 시각
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

    let query = `
      SELECT
        sti.departureTime,
        sti.trainCode,
        sti.trainType,
        sti.destinationStation,
        MAX(si.stationNameKo) as destinationNameKo,
        MAX(si.stationNameJa) as destinationNameJa,
        sti.railDirection
      FROM stationTimeInfo sti
      LEFT JOIN stationByLineInfo sbl ON sti.destinationStation = sbl.stationCode
      LEFT JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
      WHERE sti.stationCode = ?
        AND sti.calendarType = ?
        AND sti.departureTime >= ?
    `;
    const params = [stationCode, calendarType, currentTime];

    if (direction) {
      query += ' AND sti.railDirection = ?';
      params.push(direction);
    }

    // GROUP BY로 중복 방지 (같은 stationCode가 여러 노선에 있을 경우)
    query += ' GROUP BY sti.departureTime, sti.trainCode, sti.trainType, sti.destinationStation, sti.railDirection';
    query += ' ORDER BY sti.departureTime LIMIT ?';
    params.push(parseInt(count));

    const nextTrains = await db.query(query, params);

    res.json({
      success: true,
      data: {
        stationCode,
        currentTime,
        calendarType,
        direction: direction || 'all',
        nextTrains
      }
    });

  } catch (error) {
    console.error('다음 열차 조회 에러:', error);
    res.status(500).json({
      success: false,
      error: '다음 열차 조회 중 오류가 발생했습니다',
      message: error.message
    });
  }
});

// GET /api/timetable/:stationCode/stats - 역 시간표 통계
router.get('/:stationCode/stats', async (req, res) => {
  try {
    const { stationCode } = req.params;
    const { calendarType = 'weekday' } = req.query;

    // 전체 열차 수
    const total = await db.query(`
      SELECT COUNT(*) as count
      FROM stationTimeInfo
      WHERE stationCode = ? AND calendarType = ?
    `, [stationCode, calendarType]);

    // 방향별 열차 수
    const byDirection = await db.query(`
      SELECT railDirection, COUNT(*) as count
      FROM stationTimeInfo
      WHERE stationCode = ? AND calendarType = ?
      GROUP BY railDirection
    `, [stationCode, calendarType]);

    // 시간대별 열차 수
    const byHour = await db.query(`
      SELECT
        HOUR(departureTime) as hour,
        COUNT(*) as count
      FROM stationTimeInfo
      WHERE stationCode = ? AND calendarType = ?
      GROUP BY HOUR(departureTime)
      ORDER BY hour
    `, [stationCode, calendarType]);

    res.json({
      success: true,
      data: {
        stationCode,
        calendarType,
        total: total[0].count,
        byDirection,
        byHour
      }
    });

  } catch (error) {
    console.error('시간표 통계 에러:', error);
    res.status(500).json({
      success: false,
      error: '시간표 통계 조회 중 오류가 발생했습니다',
      message: error.message
    });
  }
});

module.exports = router;
