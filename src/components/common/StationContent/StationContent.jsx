import React from 'react';
import './StationContent.css'
import { LINE_ICONS } from '../../../scripts/useLineIcons.js';
import  { useStationInfoLoader } from '../../../scripts/useStationInfoLoader.js';
import { sliceStationInfoByTime } from '../../../scripts/sliceStationInfoByTime.js';
import { pre } from 'motion/react-client';

export const StationFirstContent = ({ data } = {}) =>{
    //onsole.log("[StationContent.jsx] First: ", data.stationName_kn);

    const imglink = LINE_ICONS[data?.stationLineCode];
    const lineName = data?.stationLine || "정보 없음";
    const stationNameKr = data?.stationName_kn || "역 정보 없음";
    const prevStationNameKr = useStationInfoLoader(data?.prevStationCode);
    const nextStationNameKr = useStationInfoLoader(data?.nextStationCode);
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const timeList = sliceStationInfoByTime(data?.stationCode, 3, currentTime, "Weekday");
    //console.log("TestList: ", timeList);
    

    //console.log(prevStationNameKr, nextStationNameKr);
    return (
      <div className="first-container">
        <div className="first-station-header">
          <h2 className="first-title">{stationNameKr}</h2>
          <span className="first-category">{lineName}</span>
          <div className="first-img-wrapper">
            {imglink && (
              <img src={imglink} alt={lineName} className="first-img" />
            )}
          </div>
        </div>
        <div className="first-body">
          <div className="first-body-stationinfo">
            <div className="first-staioninfo-before">
              {prevStationNameKr?.stationName_kn ?? "이전 역 없음"}
            </div>
            <div className="first-stationinfo-current">{stationNameKr}</div>
            <div className="first-stationinfo-next">
              {nextStationNameKr?.stationName_kn ?? "다음 역 없음"}
            </div>
          </div>
          <div className="first-body-timeinfo">
            <div className="timeinfo-container">
              <div className="timeinfo-header">오기쿠보 방향</div>
              <div className="timeinfo-body">
                {timeList?.map((item, index) => (
                  <div className="time-cell" key={index}>
                    <div className="destination-area">
                      {item.trainDestination}
                    </div>
                    <div className="lefttime-area">{item.departureTime}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="timeinfo-container">
              <div className="timeinfo-header">콧카이기지도마에 방향</div>
              <div className="timeinfo-body">
                {timeList?.map((item, index) => (
                  <div className="time-cell" key={index}>
                    <div className="destination-area">
                      {item.trainDestination}
                    </div>
                    <div className="lefttime-area">{item.departureTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export const StationSecondContent = ({ data } = {}) => {
  return(
    <div className="second-container">
      <div className='second-header'>
        head
      </div>
      <div className='second-body'>
        Second session body
      </div>
    </div>
  );
  
};

export default function getStationContent(stationData){
    //console.log("[StationContent.jsx]", stationData);
    if(!stationData) return { firstContent: null, secondContent: null };
    return {
        firstContent: <StationFirstContent data={stationData}/>,
        secondContent: <StationSecondContent data={stationData}/>
    };
}