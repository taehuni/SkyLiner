import React from 'react';
import './PlaceListCard.css';

export default function PlaceListCard({ data, onClick }){
  
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
          <div className="card-description">{data.descrption}</div>
          <div className="card-footer"></div>
        </div>
      </div>
    );
}