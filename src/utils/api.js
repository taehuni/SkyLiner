/**
 * API Client for SkyLiner Backend
 *
 * 백엔드 API와 통신하기 위한 유틸리티 함수들
 * 개발 환경에서는 Vite 프록시를 통해 /api 경로로 요청
 * 프로덕션 환경에서는 환경 변수로 설정된 API URL 사용
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * 공통 fetch 래퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {object} options - fetch 옵션
 * @returns {Promise<object>} API 응답 데이터
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API 요청 실패');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============================================
// Places API
// ============================================

/**
 * 장소 목록 조회
 * @param {object} params - 쿼리 파라미터
 * @param {number} params.stationGroupCode - 역 그룹 코드 (선택)
 * @param {number} params.limit - 결과 개수 (기본: 20)
 * @param {number} params.offset - 오프셋 (기본: 0)
 * @returns {Promise<object>} { success, count, data }
 */
export async function getPlaces({ stationGroupCode, limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();

  if (stationGroupCode) params.append('stationGroupCode', stationGroupCode);
  params.append('limit', limit);
  params.append('offset', offset);

  return apiRequest(`/places?${params.toString()}`);
}

/**
 * 장소 상세 정보 조회
 * @param {string} placeId - 장소 ID
 * @returns {Promise<object>} { success, data }
 */
export async function getPlaceById(placeId) {
  return apiRequest(`/places/${placeId}`);
}

/**
 * 장소 검색
 * @param {string} keyword - 검색 키워드
 * @param {number} limit - 결과 개수 (기본: 10)
 * @returns {Promise<object>} { success, count, data }
 */
export async function searchPlaces(keyword, limit = 10) {
  const params = new URLSearchParams({ keyword, limit });
  return apiRequest(`/places/search?${params.toString()}`);
}

// ============================================
// Stations API
// ============================================

/**
 * 역 목록 조회
 * @param {string} lineCode - 노선 코드 (선택)
 * @returns {Promise<object>} { success, count, data }
 */
export async function getStations(lineCode) {
  const params = lineCode ? `?lineCode=${lineCode}` : '';
  return apiRequest(`/stations${params}`);
}

/**
 * 역 상세 정보 조회
 * @param {number} stationGroupCode - 역 그룹 코드
 * @returns {Promise<object>} { success, data }
 */
export async function getStationById(stationGroupCode) {
  return apiRequest(`/stations/${stationGroupCode}`);
}

/**
 * stationCode로 역 정보 조회
 * @param {string} stationCode - 역 코드 (예: "M01", "Mb03")
 * @returns {Promise<object>} { success, data }
 */
export async function getStationByCode(stationCode) {
  return apiRequest(`/stations/by-code/${stationCode}`);
}

/**
 * 특정 역 근처 장소 조회
 * @param {number} stationGroupCode - 역 그룹 코드
 * @returns {Promise<object>} { success, count, data }
 */
export async function getPlacesByStation(stationGroupCode) {
  return apiRequest(`/stations/${stationGroupCode}/places`);
}

/**
 * 역 날씨 정보 조회
 * @param {number} stationGroupCode - 역 그룹 코드
 * @returns {Promise<object>} { success, data }
 */
export async function getStationWeather(stationGroupCode) {
  return apiRequest(`/stations/${stationGroupCode}/weather`);
}

/**
 * 역 환승 정보 조회
 * @param {number} stationGroupCode - 역 그룹 코드
 * @returns {Promise<object>} { success, data }
 */
export async function getStationTransfers(stationGroupCode) {
  return apiRequest(`/stations/${stationGroupCode}/transfers`);
}

/**
 * 모든 노선 정보 조회
 * @returns {Promise<object>} { success, count, data }
 */
export async function getAllLines() {
  return apiRequest('/stations/lines/all');
}

// ============================================
// Routes API
// ============================================

/**
 * 경로 탐색 (구현 필요시)
 * @param {number} startStationCode - 출발역 코드
 * @param {number} endStationCode - 도착역 코드
 * @returns {Promise<object>} { success, data }
 */
export async function getRoute(startStationCode, endStationCode) {
  const params = new URLSearchParams({
    start: startStationCode,
    end: endStationCode
  });
  return apiRequest(`/routes?${params.toString()}`);
}

// ============================================
// Timetable API
// ============================================

/**
 * 역 시간표 조회
 * @param {string} stationCode - 역 코드
 * @param {object} options - 쿼리 옵션
 * @param {string} options.calendarType - 요일 구분 (weekday/holiday)
 * @param {string} options.direction - 방향
 * @param {string} options.time - 시작 시간 (HH:MM)
 * @param {number} options.limit - 결과 개수
 * @returns {Promise<object>} { success, data }
 */
export async function getTimetable(stationCode, options = {}) {
  const params = new URLSearchParams();
  if (options.calendarType) params.append('calendarType', options.calendarType);
  if (options.direction) params.append('direction', options.direction);
  if (options.time) params.append('time', options.time);
  if (options.limit) params.append('limit', options.limit);

  const queryString = params.toString();
  return apiRequest(`/timetable/${stationCode}${queryString ? '?' + queryString : ''}`);
}

/**
 * 다음 열차 정보 조회 (현재 시각 기준)
 * @param {string} stationCode - 역 코드
 * @param {object} options - 쿼리 옵션
 * @param {string} options.calendarType - 요일 구분 (weekday/holiday, 기본: weekday)
 * @param {string} options.direction - 방향
 * @param {number} options.count - 결과 개수 (기본: 5)
 * @returns {Promise<object>} { success, data }
 */
export async function getNextTrains(stationCode, options = {}) {
  const params = new URLSearchParams();
  if (options.calendarType) params.append('calendarType', options.calendarType);
  if (options.direction) params.append('direction', options.direction);
  if (options.count) params.append('count', options.count);

  const queryString = params.toString();
  return apiRequest(`/timetable/${stationCode}/next${queryString ? '?' + queryString : ''}`);
}

// Default export
export default {
  // Places
  getPlaces,
  getPlaceById,
  searchPlaces,

  // Stations
  getStations,
  getStationById,
  getStationByCode,
  getPlacesByStation,
  getStationWeather,
  getStationTransfers,
  getAllLines,

  // Routes
  getRoute,

  // Timetable
  getTimetable,
  getNextTrains,
};
