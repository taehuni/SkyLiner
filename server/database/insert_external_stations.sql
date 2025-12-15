-- ========================================
-- 히비야선 외부 노선 역 추가
-- 기존 DB에 새로운 역만 추가
-- ========================================

USE subway_project;

-- 문자 인코딩 설정
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

-- 1. 도부선 추가 (이미 있으면 무시)
INSERT IGNORE INTO lineInfo (lineCode, operator, stationNumber, lineNameKo, lineNameJa, lineNameEn, color)
VALUES ('TS', '東武鉄道', 7, '도부 스카이트리 라인', '東武スカイツリーライン', 'Tobu Skytree Line', '#0D7DBF');

-- 2. 외부 역 정보 추가 (각각 변수에 저장)
INSERT INTO stationInfo (stationNameKo, stationNameJa, stationNameEn, latitude, longitude)
VALUES ('소카', '草加', 'Soka', NULL, NULL);
SET @soka_group = LAST_INSERT_ID();

INSERT INTO stationInfo (stationNameKo, stationNameJa, stationNameEn, latitude, longitude)
VALUES ('다케노츠카', '竹ノ塚', 'Takenotsuka', NULL, NULL);
SET @takenotsuka_group = LAST_INSERT_ID();

INSERT INTO stationInfo (stationNameKo, stationNameJa, stationNameEn, latitude, longitude)
VALUES ('기타코시가야', '北越谷', 'KitaKoshigaya', NULL, NULL);
SET @kitakoshigaya_group = LAST_INSERT_ID();

INSERT INTO stationInfo (stationNameKo, stationNameJa, stationNameEn, latitude, longitude)
VALUES ('도부동물공원', '東武動物公園', 'TobuDobutsuKoen', NULL, NULL);
SET @tobudoubutsukoen_group = LAST_INSERT_ID();

INSERT INTO stationInfo (stationNameKo, stationNameJa, stationNameEn, latitude, longitude)
VALUES ('기타카스카베', '北春日部', 'KitaKasukabe', NULL, NULL);
SET @kitakasukabe_group = LAST_INSERT_ID();

INSERT INTO stationInfo (stationNameKo, stationNameJa, stationNameEn, latitude, longitude)
VALUES ('구키', '久喜', 'Kuki', NULL, NULL);
SET @kuki_group = LAST_INSERT_ID();

INSERT INTO stationInfo (stationNameKo, stationNameJa, stationNameEn, latitude, longitude)
VALUES ('미나미쿠리하시', '南栗橋', 'MinamiKurihashi', NULL, NULL);
SET @minamikurihashi_group = LAST_INSERT_ID();

-- 3. 역 코드 매핑 추가 (변수 사용)
INSERT IGNORE INTO stationByLineInfo (stationCode, stationGroupCode, lineCode) VALUES
('Soka', @soka_group, 'TS'),
('Takenotsuka', @takenotsuka_group, 'TS'),
('KitaKoshigaya', @kitakoshigaya_group, 'TS'),
('TobuDobutsuKoen', @tobudoubutsukoen_group, 'TS'),
('KitaKasukabe', @kitakasukabe_group, 'TS'),
('Kuki', @kuki_group, 'TS'),
('MinamiKurihashi', @minamikurihashi_group, 'TS');

-- 확인
SELECT '✅ 외부 노선 역 7개 추가 완료!' AS result;
SELECT CONCAT('총 ', COUNT(*), '개 역이 추가되었습니다.') AS summary
FROM stationInfo
WHERE stationNameEn IN ('Soka', 'Takenotsuka', 'KitaKoshigaya', 'TobuDobutsuKoen', 'KitaKasukabe', 'Kuki', 'MinamiKurihashi');
