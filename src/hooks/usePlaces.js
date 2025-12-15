import { useState, useEffect } from 'react';
import { getPlaces } from '../utils/api';

/**
 * 장소 데이터를 가져오는 커스텀 훅
 * API에서 장소 목록을 조회하고 PlaceListCard 형식에 맞게 변환합니다.
 *
 * @param {object} options - API 호출 옵션
 * @param {number} options.stationGroupCode - 특정 역의 장소만 가져올 경우
 * @param {number} options.limit - 가져올 장소 개수 (기본: 20)
 * @returns {object} { places, loading, error }
 */
export function usePlaces(options = {}) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { stationGroupCode, limit = 20 } = options;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);

        // API 호출
        const response = await getPlaces({ stationGroupCode, limit });

        if (response.success && response.data) {
          // API 응답을 PlaceListCard 형식으로 변환
          const mappedData = response.data.map(place => ({
            id: place.id,
            name: place.placeName,
            image_link: place.imageUrl,
            hours: place.openingHours || '영업시간 정보 없음',
            rating: place.rating || 0,
            address: place.address || '주소 정보 없음',
            description: place.description,
            tags: place.tags || []
          }));

          setPlaces(mappedData);
        } else {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('[usePlaces] 장소 데이터 로드 실패:', err);
        setError(err.message);
        setPlaces([]); // 에러 시 빈 배열
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [stationGroupCode, limit]); // stationGroupCode나 limit 변경 시 재호출

  return { places, loading, error };
}
