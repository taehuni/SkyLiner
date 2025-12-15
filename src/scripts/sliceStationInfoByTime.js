import React, { useEffect, useState } from 'react';
import { getNextTrains } from '../utils/api';

export const sliceStationInfoByTime = (stationCode, count=3, time="99:99", week="none") => {
  const [stationArr, setStationArr] = useState(null);
  let currentTime = null;
  let dateMode = null;
  let timePattern = /^([01][0-9]|2[0-3]):([0-5][0-9])$/; //시간 유효성 검사용 정규식
  if (timePattern.test(time)) {
    //time을 제공 하지 않은 경우, 현재 시간을 기본 값으로 제공
    currentTime = time;
  } else {
    const today = new Date();
    const hours = today.getHours().toString().padStart(2, "0");
    const min = today.getMinutes().toString().padStart(2, "0");
    currentTime = `${hours}:${min}`;
  }
  if (week == "holiday") {
    dateMode = "stationTimeTable_Weekend";
  } else if (week == "Weekend") {
    dateMode = "stationTimeTable_Weekend";
  } else if (week == "Weekday") {
    dateMode = "stationTimeTable_Weekday";
  } else {
    //예외값 혹은 기본값인 경우 현재 날짜를 기준으로 설정
    const today = new Date();
    const dayofweek = today.getDay();
    if (dayofweek == 0 || dayofweek == 6) {
      dateMode = "stationTimeTable_Weekend";
    } else {
      dateMode = "stationTimeTable_Weekday";
    }
  }
  // 3. 시간을 분 단위 정수로 변환하는 헬퍼 함수
  const convertToMinutes = (timeStr) => {
    if (!timeStr) return -1;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    //console.log("[sliceStationInfoByTime.js]", "code:", stationCode, "count:", count, "current:", currentTime, "mode:", dateMode);
    if (stationCode != "" && time != null && count > 0) {
      const fetchTimetable = async () => {
        try {
          const calendarType = dateMode === "stationTimeTable_Weekend" ? 'holiday' : 'weekday';
          const response = await getNextTrains(stationCode, { calendarType, count });

          if (response.success && response.data && response.data.nextTrains) {
            const selectedArr = response.data.nextTrains.map(train => ({
              trainNumber: train.trainCode,
              departureTime: train.departureTime,
              trainDestination: train.destinationNameKo || train.destinationStation,
              railDirection: train.railDirection
            }));
            setStationArr(selectedArr);
          } else {
            console.log("[sliceStationInfoByTime.js] Data Not Found");
            setStationArr([]);
          }
        } catch (error) {
          console.error("[sliceStationInfoByTime.js] API Error:", error);
          setStationArr([]);
        }
      };
      fetchTimetable();
    } else {
      console.log("[sliceStationInfoByTime.js] Data Not Found");
      setStationArr([]);
    }
  }, [stationCode, count, currentTime, dateMode]);
  return stationArr;
};