import React from 'react';
import starIcon from '../source/star-icon.svg';
import pinIcon from '../source/pin-icon.svg';
import pointIcon from '../source/point-icon.svg';
import clockIcon from '../source/clock-icon.svg';
import weatherIcon from '../source/weather-icon.svg';

// 하나의 장소 정보를 표시하는 카드 컴포넌트
export default function PlaceCard({ place, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(place);
    }
  };

  return (
    <div 
      className="place-card-wrapper"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Image Card */}
      <div className="img-card">
        <img 
          src={place.imageUrl} 
          alt={place.placeName} 
        />
        <p className="img-card-label">{place.imageLabel}</p>
      </div>

      {/* Info Card */}
      <div className="info-card">
        {/* Icon Area */}
        <div className="icon-area">
          <div className="icon-wrapper">
            <svg width="25" height="25" viewBox="0 0 25 25">
              <image href={clockIcon} width="25" height="25" />
            </svg>
          </div>
          <div className="icon-wrapper direction-icon-area">
            <svg width="32" height="32" viewBox="0 0 32 32" className="point-icon">
              <image href={pointIcon} width="32" height="32" />
            </svg>
            <div className="guide-line"></div>
          </div>
          <div className="icon-wrapper">
            <svg width="21" height="25" viewBox="0 0 21 25">
              <image href={pinIcon} width="21" height="25" />
            </svg>
          </div>
        </div>

        {/* Info List */}
        <div className="info-list">
          {/* Card Row 1 - 시간 & 별점 */}
          <div className="card-row card-row-1">
            <div className="time-text">{place.openTime}</div>
            <div className="rating-area">
              <div className="star-icons">
                {[...Array(place.rating)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20">
                    <image href={starIcon} width="20" height="20" />
                  </svg>
                ))}
              </div>
              <div className="rating-count">({place.ratingCount.toLocaleString()})</div>
            </div>
          </div>

          {/* Card Row 2 - 역 정보 & 날씨 */}
          <div className="card-row card-row-2">
            <div className="station-info">
              <div className="station-name">{place.stationName}</div>
              <div className="station-distance">{place.stationDistance}</div>
            </div>
            <div className="weather-area">
              <div className="weather-icon-area">
                <svg width="48" height="50" viewBox="0 0 48 50" className="weather-icon">
                  <image href={weatherIcon} width="48" height="50" />
                </svg>
              </div>
              <div className="weather-text-container">
                <div className="weather-temp-container">
                  <div className="weather-temp">{place.temperature}</div>
                </div>
                <div className="weather-humid-container">
                  <div className="weather-humid">{place.humidity}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Row 3 - 장소 이름 */}
          <div className="card-row card-row-3">
            <div className="place-name">{place.placeName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}