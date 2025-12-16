import React from 'react';
import stationSampleData from '../sampleData/stationSampleData.json';
export const searchStationInfoByName = (txt) =>{
    const searchText = txt.trim();
    let searchedCandidate = [];
    stationSampleData.forEach((e)=>{
        if (e[`stationName_kn`] == searchText){
            searchedCandidate.push(e);
        }
    });
    console.log(searchedCandidate);
    return searchedCandidate;
};