import React, { useState, useEffect } from 'react';
import stationSampleData from '../sampleData/stationSampleData.json'

export const useStationInfoLoader = (selectedNodeId) => {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    if (!selectedNodeId) {
      setInfo(null);
      return;
    }
    //console.log("[useStationInfoLoader] selectedNodeId", typeof selectedNodeId);
    const selectedStation = stationSampleData.find(
      (i) => i.stationCode === selectedNodeId
    );
    //console.log("[useStationInfoLoader] selectedStation:", selectedStation);
    if (selectedStation) {
      setInfo(selectedStation);
    } else {
      console.log("[useStationInfoLoader.js] Data Not found");
      setInfo(null);
    }
  }, [selectedNodeId]);
  return info; 
};