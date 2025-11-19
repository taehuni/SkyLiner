import React from 'react';
import './StoreInfo.css'; // 스타일 임포트

// [첫 번째 줄] 핵심 요약 정보
// HALF 상태에서 여기까지 보입니다.
export const StoreSummary = () => {
  return (
    <div className="summary-container">
      <div className="store-header">
        <h2 className="store-title">카페 몽글몽글 강남점</h2>
        <span className="store-category">카페/디저트</span>
      </div>

      <div className="store-meta">
        <span className="rating">★ 4.8 (120)</span>
        <span className="status open">영업중</span>
        <span className="distance">1.2km</span>
      </div>

      {/* 반응형 테스트용: 화면이 좁으면 태그들이 다음 줄로 넘어감 -> 높이 변화 발생 */}
      <div className="tag-list">
        <span className="tag">#분위기좋은</span>
        <span className="tag">#디저트맛집</span>
        <span className="tag">#주차가능</span>
        <span className="tag">#애견동반</span>
      </div>
    </div>
  );
};

// [두 번째 줄] 상세 정보
// EXPANDED 상태에서만 보입니다.
export const StoreDetails = () => {
  return (
    <div className="details-container">
      <div className="detail-section">
        <h3>가게 소개</h3>
        <p className="description">
          매일 아침 굽는 신선한 베이커리와 스페셜티 커피를 즐겨보세요. 
          넓은 좌석과 편안한 분위기에서 휴식을 취할 수 있습니다.
          (화면 너비에 따라 이 텍스트는 여러 줄이 됩니다.)
        </p>
      </div>

      <div className="detail-section">
        <h3>대표 메뉴</h3>
        <ul className="menu-list">
          <li>
            <span>아메리카노</span>
            <span className="price">4,500원</span>
          </li>
          <li>
            <span>몽글 라떼</span>
            <span className="price">6,000원</span>
          </li>
          <li>
            <span>바스크 치즈 케이크</span>
            <span className="price">7,500원</span>
          </li>
        </ul>
      </div>

      <button className="action-button">길찾기 시작</button>
    </div>
  );
};