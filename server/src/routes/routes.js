// 경로 탐색 API
const express = require('express');
const router = express.Router();
const { getRouteFinder } = require('../services/routeFinder');

// GET /api/routes/search?from=M01&to=H18&algorithm=fastest&calendarType=weekday
router.get('/search', async (req, res) => {
  try {
    const { from, to, algorithm = 'fastest', calendarType = 'weekday' } = req.query;

    // 파라미터 검증
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'from과 to 파라미터가 필요합니다'
      });
    }

    if (from === to) {
      return res.status(400).json({
        success: false,
        error: '출발역과 도착역이 같습니다'
      });
    }

    // calendarType 검증
    if (!['weekday', 'holiday'].includes(calendarType)) {
      return res.status(400).json({
        success: false,
        error: 'calendarType은 weekday 또는 holiday여야 합니다'
      });
    }

    // 경로 탐색 서비스 가져오기
    const routeFinder = await getRouteFinder(calendarType);

    let result = null;

    // 알고리즘 선택
    switch (algorithm) {
      case 'fastest':
        // 최단 시간 경로
        result = routeFinder.findShortestTime(from, to);
        break;

      case 'fewest-transfers':
        // 최소 환승 경로
        result = routeFinder.findFewestTransfers(from, to);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: '알 수 없는 알고리즘입니다. fastest 또는 fewest-transfers를 사용하세요'
        });
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        error: '경로를 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      data: {
        from,
        to,
        algorithm,
        calendarType,
        route: result
      }
    });

  } catch (error) {
    console.error('경로 탐색 에러:', error);
    res.status(500).json({
      success: false,
      error: '경로 탐색 중 오류가 발생했습니다',
      message: error.message
    });
  }
});

// GET /api/routes/compare?from=M01&to=H18&calendarType=weekday
// 두 알고리즘 결과 비교
router.get('/compare', async (req, res) => {
  try {
    const { from, to, calendarType = 'weekday' } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'from과 to 파라미터가 필요합니다'
      });
    }

    // calendarType 검증
    if (!['weekday', 'holiday'].includes(calendarType)) {
      return res.status(400).json({
        success: false,
        error: 'calendarType은 weekday 또는 holiday여야 합니다'
      });
    }

    const routeFinder = await getRouteFinder(calendarType);

    const fastest = routeFinder.findShortestTime(from, to);
    const fewestTransfers = routeFinder.findFewestTransfers(from, to);

    if (!fastest && !fewestTransfers) {
      return res.status(404).json({
        success: false,
        error: '경로를 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      data: {
        from,
        to,
        calendarType,
        fastest,
        fewestTransfers
      }
    });

  } catch (error) {
    console.error('경로 비교 에러:', error);
    res.status(500).json({
      success: false,
      error: '경로 비교 중 오류가 발생했습니다',
      message: error.message
    });
  }
});

module.exports = router;
