import React from 'react';
import '../styles/DetailPage.css';
import starIcon from '../source/star-icon.svg';

function BackBtn({ onClick }) {
  return (
    <div 
      className="detail-back-btn" 
      data-name="backBtn"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <svg 
        className="detail-back-icon"
        width="100%" 
        height="100%" 
        viewBox="0 0 12 24" 
        fill="none"
      >
        <path 
          d="M10 2L2 12L10 22" 
          stroke="#554638" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function DetailNavBar({ title, onBackClick }) {
  return (
    <div className="detail-navbar" data-name="detailNavBar">
      <div className="detail-nav-background"></div>
      <BackBtn onClick={onBackClick} />
      <h1 className="detail-title-text">{title}</h1>
    </div>
  );
}

function ImageBox({ imageUrl, placeName }) {
  return (
    <div className="detail-img-box" data-name="imgBox">
      <img 
        className="detail-img"
        src={imageUrl} 
        alt={placeName} 
      />
    </div>
  );
}

function InfoBox1({ place }) {
  return (
    <div className="detail-info-box detail-info-box-1">
      <div className="detail-adr-distance-area">
        <p className="detail-adr-text">{place.address || '일본 주소 정보'}</p>
        <div className="detail-distance-info">
          <div className="detail-line-icon">
            <div className="detail-line-circle"></div>
            <span className="detail-line-letter">M</span>
          </div>
          <p className="detail-distance-text">{place.stationName}에서 {place.stationDistance}</p>
        </div>
      </div>
      <div className="detail-rating-area">
        <div className="detail-star-icons">
          {[...Array(place.rating)].map((_, i) => (
            <svg key={i} width="20" height="20" viewBox="0 0 20 20">
              <image href={starIcon} width="20" height="20" />
            </svg>
          ))}
        </div>
        <p className="detail-rating-count">({place.ratingCount.toLocaleString()})</p>
      </div>
    </div>
  );
}

function InfoBox2({ openTime, tags }) {
  return (
    <div className="detail-info-box detail-info-box-2">
      <div className="detail-clock-icon-area">
        <div className="detail-clock-icon"></div>
      </div>
      <p className="detail-time-text">{openTime}</p>
      {tags && tags.length > 0 && (
        <div className="detail-tags">
          {tags.map((tag, index) => (
            <div key={index} className="detail-tag">
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoBox3({ phoneNumber }) {
  return (
    <div className="detail-info-box detail-info-box-3">
      <div className="detail-phone-icon-area">
        <div className="detail-phone-icon"></div>
      </div>
      <p className="detail-phone-text">{phoneNumber || '전화번호 정보 없음'}</p>
    </div>
  );
}

function InfoList({ place }) {
  return (
    <div className="detail-info-list" data-name="infoList">
      <InfoBox1 place={place} />
      <InfoBox2 openTime={place.openTime} tags={place.tags} />
      <InfoBox3 phoneNumber={place.phoneNumber} />
    </div>
  );
}

export default function DetailPage({ place, onBackClick }) {
  if (!place) return null;

  return (
    <div className="detail-page" data-name="detailPage">
      <div className="detail-background"></div>
      <DetailNavBar title={place.placeName} onBackClick={onBackClick} />
      <ImageBox imageUrl={place.imageUrl} placeName={place.placeName} />
      <InfoList place={place} />
    </div>
  );
}