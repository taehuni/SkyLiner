import React, { useState, useEffect } from 'react';
import './StationContent.css'
import { LINE_ICONS } from '../../../scripts/useLineIcons.js';
import  { useStationInfoLoader } from '../../../scripts/useStationInfoLoader.js';
import { sliceStationInfoByTime } from '../../../scripts/sliceStationInfoByTime.js';
import ClockIcon from '../../../assets/icon-clock.svg';

export const StationFirstContent = ({ data, onBodyClick, type } = {}) => {
  //console.log("[StationContent.jsx] First: ", );
  const [selectedMenuId, setSelectedMenuId] = useState(
    data?.stationLineCode || "M"
  );
  const [contentType, setContentType] = useState(null);
  const imglink = LINE_ICONS[data?.stationLineCode];
  const lineName = data?.stationLine || "노선 정보 없음";
  const stationNameKr = data?.stationName_kn || "역 정보 없음";
  const prevStationNameKr = useStationInfoLoader(data?.prevStationCode);
  const nextStationNameKr = useStationInfoLoader(data?.nextStationCode);
  const menuBtnList = data?.connectingRailWayInfo;
  const showLineSelector = menuBtnList && menuBtnList.length > 0;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  const timeList = sliceStationInfoByTime(
    data?.stationCode,
    3,
    "19:00",
    "Weekday"
  );
  //console.log("TestList: ", timeList);
  useEffect(() => {
    if (data?.stationLineCode) {
      setSelectedMenuId(data.stationLineCode);
    }
    if(type!=null){
      setContentType(type);//타입별 분류용 예비
    }
  }, [data, type]);

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
      {showLineSelector && (
        <div className="first-line-selector">
          <div className="line-selector-container">
            {menuBtnList.map((i) => (
              <button
                key={i.lineCode}
                className={`line-menu-btn ${
                  selectedMenuId === i.lineCode ? "active" : ""
                }`}
                onClick={() => setSelectedMenuId(i.lineCode)}
              >
                {i.lineName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="first-body" onTouchEnd={onBodyClick}>
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
  return (
    <div className="second-container">
      <div className="second-header">
        {/*display:none 부여. 현재 표시 x*/}
        head
      </div>
      <div className="second-body">
        <div className="second-row1">
          <img src={ClockIcon} className="row1-clock-icon" />
          Second session body
        </div>
        <div className="second-row2">row2</div>
        <div className="second-row3">row3</div>
      </div>
    </div>
  );
};

export default function getStationContent(stationData, type = null, onContentClick = null) {
  //console.log("[StationContent.jsx]", stationData);
  if (!stationData) return { firstContent: null, secondContent: null };

  return {
    firstContent: (
      <StationFirstContent data={stationData} onBodyClick={onContentClick} type={type} />
    ),
    secondContent: <StationSecondContent data={stationData} />,
  };
}