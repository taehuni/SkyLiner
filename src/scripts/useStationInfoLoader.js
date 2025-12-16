import React, { useState, useEffect } from 'react';
import { getStationByCode } from '../utils/api';

export const useStationInfoLoader = (selectedNodeId, type=null) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!selectedNodeId) {
      setInfo(null);
      return;
    }

    const fetchStationInfo = async () => {
      try {
        // API에서 역 정보 가져오기
        const response = await getStationByCode(selectedNodeId);

        if (response.success && response.data) {
          // API 응답을 샘플 데이터 형식에 맞게 변환
          const mappedStation = {
            stationCode: response.data.stationCode,
            stationGroupCode: response.data.stationGroupCode,
            stationName_kn: response.data.name,
            stationName_jn: response.data.nameJa,
            stationLine: response.data.lineName,
            stationLineCode: response.data.lineCode,
            prevStationCode: response.data.prevStationCode,
            nextStationCode: response.data.nextStationCode,
            // 환승역/분기선: allLines가 2개 이상이면 같은 역의 다른 노선
            allLines: response.data.allLines || [],
            connectingRailWayInfo: response.data.connectingRailways
              ?.filter(r => r.lineCode && r.stationCode) // lineCode와 stationCode가 있는 것만 필터링
              .map(railway => ({
                lineName: railway.lineName,
                lineCode: railway.lineCode,
                stationCode: railway.stationCode
              })) || [],
            // 시간표 데이터는 별도 API에서 가져와야 함 (추후 구현)
            stationTimeTable_Weekend: [],
            stationTimeTable_Weekday: []
          };

          setInfo(mappedStation);
        } else {
          console.log("[useStationInfoLoader] Station not found:", selectedNodeId);
          setInfo(null);
        }
      } catch (error) {
        console.error("[useStationInfoLoader] API 호출 실패:", error);
        setInfo(null);
      }
    };

    fetchStationInfo();
  }, [selectedNodeId, type]);

  return info;
};
