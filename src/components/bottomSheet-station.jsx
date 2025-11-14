import React from 'react';
import { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
//import CardList from './CardList.jsx';
import '../styles/bottomSheet-station.css';
import BottomSheetTimeInfo from './bottomSheet-station-timeInfo.jsx';
import BottomSheetStationInfo from './bottomSheet-station-stationInfo.jsx';

export default function StationBottomSheet({ navbarHeight }) {
	//console.log({navbarHeight});
	const style = {
		"--rendered-navbar-height" : `${navbarHeight}px`, //--rendered-navbar-height로 css 변수 등록 px단위.
	};
	return(
		<div className="bottomsheet-container" style={style}>{/*위에서 등록한 css 변수를 style로 전달*/}

			<div className="bottomsheet-head">
				<div></div>
			</div>


			<div className="bottomsheet-body">
				<div className="title-container">
					<span>역 정보</span>
					<div></div>
				</div>
				<div className="station-container">
					<div className="prevStation-container">
						<span className="station-text">콧카이기지도마에</span>
					</div>
					<div className="currentStation-container">
						<span className="station-text currentStation">카스미가세키</span>
					</div>
					<div className="nextStation-container">
						<span className="station-text">긴자</span>
					</div>
				</div>
				<div className="stationTimeInfo-container">
						<BottomSheetTimeInfo 
							stationType="prev"
						/>
						<BottomSheetTimeInfo 
							stationType="next"
						/>
				</div>
				<div className="stationInfo-container">
					<BottomSheetStationInfo />
				</div>
			</div>
		</div>

		);
}