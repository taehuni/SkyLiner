import React from 'react';
import '../styles/bottomSheet-station-stationInfo.css';
import RatingOperator from './RatingOperator.jsx';
import ClockIcon from '../assets/icon-clock.svg';
import TrainIcon from '../assets/icon-train.svg';
import PinIcon from '../assets/icon-pin.svg';
import SunnyIcon from '../assets/icon-weather-cloudsunny.svg';

export default function BottomSheetStationInfo() {
	const getRatingScore = 5;
	const getRatingCount = 10000;
	return (
		<div className="info-container">
			<div className="info-operation-rating-container">
				<img src={ClockIcon} className="icon-clock"></img>
				<span className="info-operation-text">10:00 - 20:30</span>
				<div className="info-rating-container">
					<RatingOperator
						ratingScore={getRatingScore}
						ratingCount={getRatingCount}
					/>
				</div>
			</div>
			<div className="info-disatance-weather-container">
				<img src={TrainIcon} className="icon-train"></img>
				<div className="info-disatance-container">
					<span className="info-distance-station">카스미가세키역 까지</span>
					<span className="info-distance-distance">0.23km</span>
				</div>
				<div className="info-weather-container">
					<img src={SunnyIcon}></img>
					<div className="info-weather-temp-humid-container">
						<span className="info-weather-temp">26°C</span>
						<span className="info-weather-humid">70%</span>
					</div>
				</div>
			</div>
			<div className="info-address-container">
				<img src={PinIcon} className="icon-pin"></img>
				<span className="info-address-text">일본 〒350-1103 사이타마현 가와고에시 가스미가세키히가시 1 조메</span>
			</div>
		</div>
		);
}