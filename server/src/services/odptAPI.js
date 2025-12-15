const axios = require('axios');
require('dotenv').config();

const ODPT_API_KEY = process.env.ODPT_API_KEY;
const BASE_URL = 'https://api.odpt.org/api/v4';

// 역 정보 조회
const getStations = async (operatorId = null) => {
  try {
    const params = {
      'acl:consumerKey': ODPT_API_KEY
    };

    if (operatorId) {
      params['odpt:operator'] = operatorId;
    }

    const response = await axios.get(`${BASE_URL}/odpt:Station`, { params });
    return response.data;
  } catch (error) {
    console.error('Get Stations Error:', error.message);
    throw error;
  }
};

// 특정 역 정보 조회
const getStationById = async (stationId) => {
  try {
    const response = await axios.get(`${BASE_URL}/odpt:Station`, {
      params: {
        'acl:consumerKey': ODPT_API_KEY,
        'owl:sameAs': stationId
      }
    });

    return response.data[0] || null;
  } catch (error) {
    console.error('Get Station By ID Error:', error.message);
    throw error;
  }
};

// 노선 정보 조회
const getRailways = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/odpt:Railway`, {
      params: {
        'acl:consumerKey': ODPT_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get Railways Error:', error.message);
    throw error;
  }
};

// 특정 노선의 역 목록
const getStationsByRailway = async (railwayId) => {
  try {
    const response = await axios.get(`${BASE_URL}/odpt:Station`, {
      params: {
        'acl:consumerKey': ODPT_API_KEY,
        'odpt:railway': railwayId
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get Stations By Railway Error:', error.message);
    throw error;
  }
};

// 열차 운행 정보
const getTrainTimetable = async (railwayId, stationId) => {
  try {
    const response = await axios.get(`${BASE_URL}/odpt:TrainTimetable`, {
      params: {
        'acl:consumerKey': ODPT_API_KEY,
        'odpt:railway': railwayId,
        'odpt:station': stationId
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get Train Timetable Error:', error.message);
    throw error;
  }
};

// 데이터 변환 헬퍼
const transformStationData = (odptStation) => {
  // ODPT 데이터를 우리 DB 형식으로 변환
  const stationTitle = odptStation['odpt:stationTitle'] || {};

  return {
    odpt_id: odptStation['owl:sameAs'],
    name_ja: stationTitle.ja || odptStation['dc:title'],
    name_ja_hkt: stationTitle['ja-Hrkt'] || null,
    name_ko: stationTitle.ko || null,
    name_en: stationTitle.en || null,
    name_zh_hans: stationTitle['zh-Hans'] || null,
    name_zh_hant: stationTitle['zh-Hant'] || null,
    line_id: odptStation['odpt:railway'],
    latitude: odptStation['geo:lat'],
    longitude: odptStation['geo:long'],
    station_code: odptStation['odpt:stationCode'],
    exit_info: odptStation['odpt:exit'] ? JSON.stringify(odptStation['odpt:exit']) : null
  };
};

const transformRailwayData = (odptRailway) => {
  const railwayTitle = odptRailway['odpt:railwayTitle'] || {};
  const stationOrder = odptRailway['odpt:stationOrder'] || [];

  return {
    odpt_id: odptRailway['owl:sameAs'],
    line_code: odptRailway['odpt:lineCode'] || null,
    name_ja: railwayTitle.ja || odptRailway['dc:title'],
    name_ja_hkt: railwayTitle['ja-Hrkt'] || null,
    name_ko: railwayTitle.ko || null,
    name_en: railwayTitle.en || null,
    name_zh_hans: railwayTitle['zh-Hans'] || null,
    name_zh_hant: railwayTitle['zh-Hant'] || null,
    color: odptRailway['odpt:color'],
    operator: odptRailway['odpt:operator'],
    station_number: stationOrder.length
  };
};

module.exports = {
  getStations,
  getStationById,
  getRailways,
  getStationsByRailway,
  getTrainTimetable,
  transformStationData,
  transformRailwayData
};