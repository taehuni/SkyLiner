const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// 주변 장소 검색
const searchNearbyPlaces = async (latitude, longitude, radius = 1000, type = 'tourist_attraction') => {
  try {
    const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
      params: {
        location: `${latitude},${longitude}`,
        radius,
        type,
        key: GOOGLE_API_KEY,
        language: 'ja'  // 일본어
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google API Error: ${response.data.status}`);
    }

    return response.data.results;
  } catch (error) {
    console.error('Search Nearby Places Error:', error.message);
    throw error;
  }
};

// 장소 상세 정보 조회
const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,user_ratings_total,formatted_address,formatted_phone_number,opening_hours,photos,website,types',
        key: GOOGLE_API_KEY,
        language: 'ja'
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google API Error: ${response.data.status}`);
    }

    return response.data.result;
  } catch (error) {
    console.error('Get Place Details Error:', error.message);
    throw error;
  }
};

// 장소 사진 URL 생성
const getPhotoUrl = (photoReference, maxWidth = 400) => {
  if (!photoReference) return null;
  
  return `${BASE_URL}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
};

// 텍스트 검색
const searchPlacesByText = async (query, location = null) => {
  try {
    const params = {
      query,
      key: GOOGLE_API_KEY,
      language: 'ja'
    };

    if (location) {
      params.location = `${location.latitude},${location.longitude}`;
      params.radius = 5000;
    }

    const response = await axios.get(`${BASE_URL}/textsearch/json`, { params });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google API Error: ${response.data.status}`);
    }

    return response.data.results || [];
  } catch (error) {
    console.error('Search Places By Text Error:', error.message);
    throw error;
  }
};

// 데이터 변환 헬퍼
const transformPlaceData = (googlePlace, stationInfo = null) => {
  const photos = googlePlace.photos || [];
  const photoUrl = photos.length > 0 ? getPhotoUrl(photos[0].photo_reference) : null;

  return {
    google_place_id: googlePlace.place_id,
    name: googlePlace.name,
    image_url: photoUrl,
    rating: googlePlace.rating || 0,
    rating_count: googlePlace.user_ratings_total || 0,
    address: googlePlace.vicinity || googlePlace.formatted_address,
    types: googlePlace.types ? JSON.stringify(googlePlace.types) : null,
    latitude: googlePlace.geometry?.location?.lat,
    longitude: googlePlace.geometry?.location?.lng,
    station_id: stationInfo?.id || null,
    station_distance: stationInfo?.distance || null
  };
};

module.exports = {
  searchNearbyPlaces,
  getPlaceDetails,
  getPhotoUrl,
  searchPlacesByText,
  transformPlaceData
};