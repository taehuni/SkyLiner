import React from 'react';
import '../styles/bottomSheet-station-timeInfo.css';

export default function BottomSheetTimeInfo({stationType}){
	return(
		<div className="timeTable-container">
			<div className="timeTable-title-container">
				<span>{stationType}역 방향</span>
				<div></div>
			</div>
			<div className="timeTable-body-container">
				<div className="timeTable-info-container">
					<div className="timeTable-info-station">
						<span>오기쿠보역</span>
					</div>
					<div className="timeTable-info-leftTime">
						<span>999분</span>
					</div>
				</div>
				<div className="timeTable-info-container">
					<div className="timeTable-info-station">
						<span>오기쿠보역</span>
					</div>
					<div className="timeTable-info-leftTime">
						<span>999분</span>
					</div>
				</div>
				<div className="timeTable-info-container">
					<div className="timeTable-info-station">
						<span>오기쿠보역</span>
					</div>
					<div className="timeTable-info-leftTime">
						<span>999분</span>
					</div>
				</div>
			</div>
		</div>

	);
}