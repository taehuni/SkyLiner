import React from 'react';
import PlaceCard from './PlaceCard.jsx';
import '../styles/BottomSheet.css';
// bottomSheetDrag.js가 externalHeadRef를 받도록 수정되었다고 가정
import { useBottomSheetDrag } from '../scripts/bottomSheetDrag'; 

// 1. 'headRef'를 prop으로 받습니다 (App.jsx에서 전달됨).
export default function BottomSheet({ places, onPlaceClick, headRef: providedHeadRef }) {
  const {
    isExpanded,
    isDragging,
    sheetRef,
    // 2. 훅이 반환하는 headRef를 사용 (이 ref는 providedHeadRef와 동일).
    headRef, 
    handleMouseDown,
    getTransformStyle,
  } = useBottomSheetDrag(providedHeadRef); // 3. 훅에 ref를 전달합니다.

  // ... (데이터가 없으면 return null) ...
  if (!places || places.length === 0) return null;

  return (
    <div 
      ref={sheetRef}
      className={`bottom-sheet ${isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: getTransformStyle()
      }}
    >
      {/* Head Area */}
      <div 
        // 4. 이 div에 ref를 연결합니다.
        ref={headRef} 
        className="bottom-sheet-head"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="head-bar"></div>
      </div>

      {/* Title Area */}
      <div className="bottom-sheet-title">
        <p>핫플레이스</p>
        <div className="title-underline"></div>
      </div>

      {/* Body Area - PlaceCard 리스트 */}
      <div className="bottom-sheet-body">
        {places.map((place) => (
          <PlaceCard 
            key={place.id} 
            place={place}
            onClick={onPlaceClick}
          />
        ))}
      </div>
    </div>
  );
}