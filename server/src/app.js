const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const { updateWeather } = require('./services/weatherService');

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로그
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkyLiner API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// API 라우트 등록
app.use('/api/places', require('./routes/places'));
app.use('/api/stations', require('./routes/stations'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/timetable', require('./routes/timetable'));

// 404 에러 처리
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 날씨 자동 업데이트 (30분마다)
cron.schedule('*/30 * * * *', async () => {
  console.log('[Cron] 날씨 자동 업데이트 시작...');
  try {
    await updateWeather();
  } catch (error) {
    console.error('[Cron] 날씨 업데이트 실패:', error.message);
  }
});

// 서버 시작 시 첫 날씨 수집
(async () => {
  console.log('[Init] 초기 날씨 데이터 수집...');
  try {
    await updateWeather();
  } catch (error) {
    console.error('[Init] 초기 날씨 수집 실패:', error.message);
  }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 SkyLiner Server Started`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});

module.exports = app;