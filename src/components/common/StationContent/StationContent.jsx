import React, { useState, useEffect } from 'react';
import './StationContent.css'
import { LINE_ICONS } from '../../../scripts/useLineIcons.js';
import  { useStationInfoLoader } from '../../../scripts/useStationInfoLoader.js';
import { sliceStationInfoByTime } from '../../../scripts/sliceStationInfoByTime.js';
import ClockIcon from '../../../assets/icon-clock.svg';

export const StationFirstContent = ({ data, onStationChange } = {}) =>{
    //console.log("[StationContent.jsx] First: ", data.stationName_kn);
    const [selectedMenuId, setSelectedMenuId] = useState(data?.stationLineCode || "M");
    const [selectedStationCode, setSelectedStationCode] = useState(data?.stationCode);

    // 환승역/분기선: allLines가 2개 이상이면 같은 역의 다른 노선
    const allLines = data?.allLines || [];

    // 다른 노선인지 확인 (같은 노선 분기선은 제외)
    // M과 Mb는 같은 노선으로 간주 (소문자 제거)
    const uniqueLineGroups = [...new Set(allLines.map(l => l.lineCode.replace(/[a-z]/g, '')))];
    const hasMultipleLines = uniqueLineGroups.length > 1;

    // 선택된 노선의 정보 가져오기
    const selectedLine = hasMultipleLines
      ? allLines.find(line => line.lineCode === selectedMenuId) || allLines[0]
      : null;

    const imglink = LINE_ICONS[selectedMenuId];
    const lineName = selectedLine?.lineName || data?.stationLine || "노선 정보 없음";
    const stationNameKr = data?.stationName_kn || "역 정보 없음";
    const currentStationCode = selectedLine?.stationCode || data?.stationCode;

    // 선택된 노선의 이전/다음 역 정보
    const prevCode = selectedLine?.prevStationCode || data?.prevStationCode;
    const nextCode = selectedLine?.nextStationCode || data?.nextStationCode;

    const prevStationNameKr = useStationInfoLoader(prevCode);
    const nextStationNameKr = useStationInfoLoader(nextCode);

    // 환승역/분기선(같은 역에 여러 노선)일 때만 line selector 표시
    const menuBtnList = hasMultipleLines ? allLines : [];
    const showLineSelector = hasMultipleLines;

    const handleLineChange = (lineCode, stationCode) => {
      setSelectedMenuId(lineCode);
      setSelectedStationCode(stationCode);

      // 환승역/분기선이 아닌 경우만 onStationChange 호출
      if (!hasMultipleLines && onStationChange && stationCode) {
        onStationChange(stationCode);
      }
    };

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    // 선택된 노선의 stationCode로 시간표 조회 (현재 시간 기준)
    const timeList = sliceStationInfoByTime(currentStationCode, 10, currentTime, "Weekday");

    // 방향별로 시간표 분리
    const forwardTrains = timeList?.filter(t => t.railDirection === 'forward').slice(0, 3) || [];
    const backwardTrains = timeList?.filter(t => t.railDirection === 'backward').slice(0, 3) || [];
    //console.log("TestList: ", timeList);

    useEffect(() => {
      // 역이 변경될 때마다 해당 역의 노선으로 초기화
      if (data?.stationLineCode) {
        setSelectedMenuId(data.stationLineCode);
        setSelectedStationCode(data.stationCode);
      }
    }, [data?.stationCode]);


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
                  onClick={() => handleLineChange(i.lineCode, i.stationCode)}
                >
                  {i.lineName}
                </button>
              ))}
            </div>
          </div>
        )}

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
              <div className="timeinfo-header">정방향</div>
              <div className="timeinfo-body">
                {forwardTrains.map((item, index) => (
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
              <div className="timeinfo-header">역방향</div>
              <div className="timeinfo-body">
                {backwardTrains.map((item, index) => (
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

export default function getStationContent(stationData, onStationChange){
    //console.log("[StationContent.jsx]", stationData);
    if(!stationData) return { firstContent: null, secondContent: null };
    return {
        firstContent: <StationFirstContent data={stationData} onStationChange={onStationChange} />,
        secondContent: <StationSecondContent data={stationData}/>
    };
}