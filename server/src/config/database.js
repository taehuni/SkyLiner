const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// 연결 테스트 함수
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Host: ${process.env.DB_HOST}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    return false;
  }
};

// 서버 시작 시 연결 테스트
testConnection();

// 쿼리 헬퍼 함수 (수정됨)
const query = async (sql, params = []) => {
  try {
    // params가 undefined이거나 null이면 빈 배열로 설정
    const safeParams = params || [];
    
    // execute 대신 query 사용 (더 안정적)
    const [rows] = await pool.query(sql, safeParams);
    return rows;
  } catch (error) {
    console.error('Query Error:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};