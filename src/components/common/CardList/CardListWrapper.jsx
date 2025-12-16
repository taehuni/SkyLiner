import React from "react";
import './CardListWrapper.css';
import PlaceListCard from '../../cards/PlaceListCard';

export default function CardListWrapper({ cardData }) {
  const hasData = cardData && cardData.length > 0;
  const handleCardClick = (id) =>{
    console.log("id: ", id);
  };

  return (
    <>
      {hasData ? (
        cardData.map((data, index) => (
          // key는 고유한 id를 사용하는 것이 좋습니다. (data.id가 있다면 사용)
          <PlaceListCard
          key={data.id || index}
          data={data}
          onClick={()=>handleCardClick(data.id)}
          />
        ))
      ) : (
        <div className="no-data-message">표시할 장소가 없습니다.</div>
      )}
    </>
  );
}