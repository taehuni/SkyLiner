import React from 'react';
import './PlaceListCard.css';

export default function PlaceListCard({ data, onClick }){

  // 설명 우선, 없으면 태그, 그것도 없으면 주소 표시
  const getDescriptionText = () => {
    if (data.description) {
      return data.description;
    }
    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
      return data.tags.join(', ');
    }
    return data.address;
  };

    return (
      <div className="card-body" onClick={onClick}>
        <div className="card-img-wrapper">
          <img src={data.image_link} alt={data.name} className="card-img" />
        </div>
        <div className="card-content">
          <div className="card-header">
            <div className="card-title">{data.name}</div>
            <div className="card-info">
              <div className="operating-hour">{data.hours}</div>
              <div className="rating-score">{data.rating}</div>
            </div>
          </div>
          <div className="card-description">{getDescriptionText()}</div>
          <div className="card-footer"></div>
        </div>
      </div>
    );
}