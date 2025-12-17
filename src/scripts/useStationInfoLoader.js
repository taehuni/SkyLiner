import React, { useState, useEffect } from 'react';
import stationSampleData from '../sampleData/stationSampleData.json'
import placeSampleData from '../sampleData/placeSampleData.json';
import stationInfo from '../sampleData/newSample/processedStation.json';
import timeTable from '../sampleData/newSample/processedStationTimeTable.json';

export const useStationInfoLoader = (selectedNodeId, type=null) => {
  const [info, setInfo] = useState(null);
  let RAILWAY_STRUCTURE ={
    lineCode: "",
    lineName: ""
  };
  let SCHEDULE_STRUCTURE = {
    departureTime: "",
    trainDestination: "",
    trainNumber: ""
  };
  let BASE_STURCTURE = {
    connectingRailwayInfo:[],
    nextStationCode: "",
    prevStationCode: "",
    stationCode: null,
    stationLine: null,
    stationLineCode: null,
    stationName_jn: null,
    stationName_kn: null,
    stationTimeTable : {
      Weekday_up : [],
      Weekday_down : [],
      Weekend_up: [],
      Weekend_down: []
    },
  }
  useEffect(() => {
    if (!selectedNodeId) {
      setInfo(null);
      return;
    }
    //console.log("[useStationInfoLoader] selectedNodeId", typeof selectedNodeId);
    let stationData = stationInfo.find(
      (i) => i?.stationCode === selectedNodeId
    );
    //console.log("[useStationInfoLoader] selectedStation:", selectedStation);
    if (stationData) {
      BASE_STURCTURE.stationCode = stationData.stationCode;
      BASE_STURCTURE.stationLine = stationData.stationRailwayKr;
      BASE_STURCTURE.stationLineCode = stationData.stationRailwayCode;
      BASE_STURCTURE.stationName_jn = stationData.stationTitle.ja;
      BASE_STURCTURE.stationName_kn = stationData.stationTitle.kr;
      stationData.stationConnectingRailway.forEach((e)=>{
        RAILWAY_STRUCTURE.lineCode = e;
        RAILWAY_STRUCTURE.lineName = e;
        BASE_STURCTURE.connectingRailwayInfo.push(RAILWAY_STRUCTURE);
      });
      
      stationData.stationTimeTableType.forEach((e)=>{
        const name = e.split(".");
        const timetablestation = 
        const stationcode = stationData.find(
          (i) => i?.stationTitle.en === name[1]
        ).stationCode;
        const stationIndex = parseInt(stationcode.replace(BASE_STURCTURE.stationLineCode,""));
        const currentStationIndex = parseInt(BASE_STURCTURE.stationCode.replace(BASE_STURCTURE.stationLineCode, ""));
        let weektype;
        let railtype;
        if(stationIndex > currentStationIndex){
          railtype = "up";
        } else if (stationIndex < currentStationIndex){
          railtype = "down";
        }
        if(name[2] == "Weekday"){
          weektype = "Weekday";
        } else {
          weektype = "Weekend";
        }
        timeTable.forEach((e)=>{
          if(e.line == BASE_STURCTURE.stationLine){
            if(e.)
          }
        })
      });


      if (type == "detail") {
        stationData.imageLink = placeSampleData[0][`image_link`];
        setInfo(stationData);
      } else {
        setInfo(stationData);
      }
    } else {
      console.log("[useStationInfoLoader.js] Data Not found");
      setInfo(null);
    }
  }, [selectedNodeId, type]);
  return info; 
};