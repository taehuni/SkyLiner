import React, { useState, useEffect } from 'react';
import stationSampleData from '../sampleData/stationSampleData.json'
import placeSampleData from '../sampleData/placeSampleData.json';

export const useStationInfoLoader = (selectedNodeId, type=null) => {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    if (!selectedNodeId) {
      setInfo(null);
      return;
    }
    //console.log("[useStationInfoLoader] selectedNodeId", typeof selectedNodeId);
    let selectedStation = stationSampleData.find(
      (i) => i?.stationCode === selectedNodeId
    );
    //console.log("[useStationInfoLoader] selectedStation:", selectedStation);
    if (selectedStation) {
        if(type=="detail"){
          selectedStation.imageLink = placeSampleData[0][`image_link`];
          setInfo(selectedStation);
        } else{
          setInfo(selectedStation);
        }
    } else {
      console.log("[useStationInfoLoader.js] Data Not found");
      setInfo(null);
    }
  }, [selectedNodeId, type]);
  return info; 
};