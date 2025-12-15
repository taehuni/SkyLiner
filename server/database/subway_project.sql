-- ========================================
-- SkyLiner Database Schema
-- 최종 업데이트: 2025-11-26
--
-- 주요 변경사항:
-- - stationByLineInfo에 odptId 추가 (노선별 ODPT 식별자)
-- - trainInfo 삭제 (stationTimeInfo에 통합)
-- - stationConnectionInfo 추가 (역 간 연결 정보, 경로 탐색용)
-- - stationTimeInfo 재구성 (역별 시간표)
-- ========================================

CREATE DATABASE IF NOT EXISTS subway_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE subway_project;

-- ========================================
-- 1. 노선 정보 (lineInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS lineInfo (
  lineCode VARCHAR(16) PRIMARY KEY,
  operator VARCHAR(32),
  stationNumber SMALLINT,
  lineNameKo VARCHAR(64),
  lineNameJa VARCHAR(128),
  lineNameJa_Hkt VARCHAR(128),
  lineNameEn VARCHAR(32),
  lineNameZh_Hans VARCHAR(128),
  lineNameZh_Hant VARCHAR(128),
  color VARCHAR(20) COMMENT '노선 색상 추가',
  odptId VARCHAR(200) UNIQUE COMMENT 'ODPT API ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_operator (operator)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 2. 역 정보 (stationInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS stationInfo (
  stationGroupCode SMALLINT PRIMARY KEY AUTO_INCREMENT,
  latitude DOUBLE,
  longitude DOUBLE,
  stationNameKo VARCHAR(64),
  stationNameJa VARCHAR(128),
  stationNameJa_Hkt VARCHAR(128),
  stationNameEn VARCHAR(32),
  stationNameZh_Hans VARCHAR(128),
  stationNameZh_Hant VARCHAR(128),
  odptId VARCHAR(200) UNIQUE COMMENT 'ODPT API ID',
  exitInfo JSON COMMENT '출구 정보',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 3. 노선별 역 정보 (stationByLineInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS stationByLineInfo (
  stationCode VARCHAR(8) PRIMARY KEY,
  stationGroupCode SMALLINT,
  lineCode VARCHAR(16),
  odptId VARCHAR(128) COMMENT 'ODPT Station ID (per line)',
  FOREIGN KEY (stationGroupCode) REFERENCES stationInfo(stationGroupCode) ON DELETE CASCADE,
  FOREIGN KEY (lineCode) REFERENCES lineInfo(lineCode) ON DELETE CASCADE,
  INDEX idx_line (lineCode),
  INDEX idx_group (stationGroupCode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 4. 역 간 연결 정보 (stationConnectionInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS stationConnectionInfo (
  indexNo MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
  stationCode VARCHAR(8) NOT NULL,
  nextStationCode VARCHAR(8) NOT NULL,
  railDirection VARCHAR(64) COMMENT 'forward or backward',
  timeToNextStation TINYINT COMMENT '다음 역까지 소요시간 (분)',
  distanceToNextStation SMALLINT COMMENT '다음 역까지 거리 (m)',
  calendarType VARCHAR(16) NOT NULL COMMENT 'weekday or holiday',
  FOREIGN KEY (stationCode) REFERENCES stationByLineInfo(stationCode) ON DELETE CASCADE,
  UNIQUE KEY unique_connection (stationCode, nextStationCode, calendarType),
  INDEX idx_station (stationCode),
  INDEX idx_calendar (calendarType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 5. 역별 시간표 (stationTimeInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS stationTimeInfo (
  indexNo INT PRIMARY KEY AUTO_INCREMENT,
  stationCode VARCHAR(8) NOT NULL,
  departureTime TIME NOT NULL COMMENT '출발 시각',
  trainCode VARCHAR(64) COMMENT '열차 코드',
  trainType VARCHAR(64) COMMENT '열차 종류 (普通, 快速 등)',
  destinationStation VARCHAR(128) COMMENT '종착역',
  railDirection VARCHAR(64) COMMENT '방향 (forward/backward)',
  calendarType VARCHAR(16) NOT NULL COMMENT 'weekday or holiday',
  FOREIGN KEY (stationCode) REFERENCES stationByLineInfo(stationCode) ON DELETE CASCADE,
  UNIQUE KEY unique_departure (stationCode, departureTime, calendarType, trainCode),
  INDEX idx_station_time (stationCode, calendarType, departureTime),
  INDEX idx_calendar (calendarType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 6. 환승 정보 (transferInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS transferInfo (
  indexNo SMALLINT PRIMARY KEY AUTO_INCREMENT,
  fromStationCode VARCHAR(8),
  toStationCode VARCHAR(8),
  travelTime TINYINT,
  FOREIGN KEY (fromStationCode) REFERENCES stationByLineInfo(stationCode) ON DELETE CASCADE,
  FOREIGN KEY (toStationCode) REFERENCES stationByLineInfo(stationCode) ON DELETE CASCADE,
  INDEX idx_from (fromStationCode),
  INDEX idx_to (toStationCode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 7. 환승 노선 정보 (connectingRailwayInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS connectingRailwayInfo (
  stationGroupCode SMALLINT,
  railwayName VARCHAR(128),
  PRIMARY KEY (stationGroupCode, railwayName),
  FOREIGN KEY (stationGroupCode) REFERENCES stationInfo(stationGroupCode) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 8. 장소 정보 (placeInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS placeInfo (
  placeID VARCHAR(128) PRIMARY KEY,
  imageReference VARCHAR(128),
  name VARCHAR(128),
  rating FLOAT,
  ratingCount SMALLINT,
  placeMainType VARCHAR(64),
  address VARCHAR(256),
  latitude DOUBLE COMMENT '위도 추가',
  longitude DOUBLE COMMENT '경도 추가',
  phoneNumber VARCHAR(50) COMMENT '전화번호 추가',
  website VARCHAR(500) COMMENT '웹사이트 추가',
  description TEXT COMMENT '설명 추가',
  tags JSON COMMENT '태그 추가',
  isActive BOOLEAN DEFAULT true COMMENT '활성화 여부',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rating (rating, ratingCount),
  INDEX idx_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 9. 역 근처 장소 정보 (stationNearByInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS stationNearByInfo (
  placeID VARCHAR(128),
  stationGroupCode SMALLINT,
  distanceFromStation FLOAT,
  PRIMARY KEY (placeID, stationGroupCode),
  FOREIGN KEY (placeID) REFERENCES placeInfo(placeID) ON DELETE CASCADE,
  FOREIGN KEY (stationGroupCode) REFERENCES stationInfo(stationGroupCode) ON DELETE CASCADE,
  INDEX idx_station (stationGroupCode),
  INDEX idx_distance (distanceFromStation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 10. 장소 영업시간 (placeOpeningInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS placeOpeningInfo (
  placeID VARCHAR(128) PRIMARY KEY,
  monday TIME,
  tuesday TIME,
  wednesday TIME,
  thursday TIME,
  friday TIME,
  saturday TIME,
  sunday TIME,
  FOREIGN KEY (placeID) REFERENCES placeInfo(placeID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 11. 날씨 정보 (weatherInfo)
-- ========================================
CREATE TABLE IF NOT EXISTS weatherInfo (
  stationGroupCode SMALLINT,
  time DATETIME,
  weatherStatus ENUM('sunny', 'cloudy', 'rainy', 'snowy'),
  temp FLOAT,
  tempFeel FLOAT,
  humidity TINYINT,
  cloud TINYINT,
  rainFall FLOAT,
  snowFall FLOAT,
  PRIMARY KEY (stationGroupCode, time),
  FOREIGN KEY (stationGroupCode) REFERENCES stationInfo(stationGroupCode) ON DELETE CASCADE,
  INDEX idx_time (time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 12. 데이터 동기화 로그 (추가)
-- ========================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sync_type ENUM('stations', 'places', 'lines', 'weather') NOT NULL,
  status ENUM('success', 'failed', 'running') NOT NULL,
  records_processed INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  INDEX idx_sync_type (sync_type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 샘플 데이터
-- ========================================

-- 노선 정보
INSERT INTO lineInfo (lineCode, operator, stationNumber, lineNameKo, lineNameJa, lineNameEn, color) VALUES
('JY', 'JR East', 30, '야마노테선', '山手線', 'Yamanote Line', '#9ACD32'),
('JC', 'JR East', 39, '주오선', '中央線', 'Chuo Line', '#FF6600'),
('G', 'Tokyo Metro', 19, '긴자선', '銀座線', 'Ginza Line', '#FF9500'),
('TS', '東武鉄道', 7, '도부 스카이트리 라인', '東武スカイツリーライン', 'Tobu Skytree Line', '#0D7DBF');

-- 역 정보
INSERT INTO stationInfo (stationNameKo, stationNameJa, stationNameEn, latitude, longitude) VALUES
('신주쿠', '新宿', 'Shinjuku', 35.689729, 139.700584),
('시부야', '渋谷', 'Shibuya', 35.658034, 139.701636),
('도쿄', '東京', 'Tokyo', 35.681382, 139.766084),
-- 도부선 외부 역 (히비야선 시간표 목적지용)
('소카', '草加', 'Soka', NULL, NULL),
('다케노츠카', '竹ノ塚', 'Takenotsuka', NULL, NULL),
('기타코시가야', '北越谷', 'KitaKoshigaya', NULL, NULL),
('도부동물공원', '東武動物公園', 'TobuDobutsuKoen', NULL, NULL),
('기타카스카베', '北春日部', 'KitaKasukabe', NULL, NULL),
('구키', '久喜', 'Kuki', NULL, NULL),
('미나미쿠리하시', '南栗橋', 'MinamiKurihashi', NULL, NULL);

-- 노선별 역 정보
INSERT INTO stationByLineInfo (stationCode, stationGroupCode, lineCode) VALUES
('JY17', 1, 'JY'),
('JY20', 2, 'JY'),
('JY01', 3, 'JY'),
-- 도부선 외부 역 (시간표 destinationStation 매핑용)
('Soka', 4, 'TS'),
('Takenotsuka', 5, 'TS'),
('KitaKoshigaya', 6, 'TS'),
('TobuDobutsuKoen', 7, 'TS'),
('KitaKasukabe', 8, 'TS'),
('Kuki', 9, 'TS'),
('MinamiKurihashi', 10, 'TS');

-- ========================================
-- 뷰 생성
-- ========================================
CREATE OR REPLACE VIEW places_with_station AS
SELECT 
  p.*,
  s.stationNameKo,
  s.stationNameJa,
  s.stationNameEn,
  n.distanceFromStation
FROM placeInfo p
LEFT JOIN stationNearByInfo n ON p.placeID = n.placeID
LEFT JOIN stationInfo s ON n.stationGroupCode = s.stationGroupCode;

-- ========================================
-- 완료
-- ========================================
SELECT 'Database schema created successfully!' as message;
SELECT 'All tables from original ERD are preserved!' as note;
