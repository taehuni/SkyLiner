import React from 'react';
import '../styles/RatingOperator.css';
import StarIcon from '../assets/icon-star.svg';

export default function RatingOperator({ ratingScore, ratingCount }) {
    // 1. 실수 값 처리: 1 ~ 5 사이로 제한 후 정수화 (활성화 개수)
    const clampedScore = Math.max(1, Math.min(5, ratingScore));
    const score = Math.floor(clampedScore); // 활성화할 이미지 개수 (1~5)
    // 2. 정수 값 처리: 0 ~ 99999 사이로 제한 후 콤마 포맷팅
    const clampedCound = Math.max(0, Math.min(99999, ratingCount));
    const count = clampedCound.toLocaleString(); // 콤마 포맷팅된 문자열 (예: "99,999")
    const maxImages = 5;
    // 0부터 maxImages-1 까지의 인덱스 배열 생성 (5개 이미지 렌더링용)
    const starIndices = Array.from({ length: maxImages }, (_, i) => i);
    return(
        <div className="rating-container">
            <div className="rating-icon-container">
                
                {/* 💡 이미지 5개를 동적으로 렌더링 */}
                {starIndices.map((index) => {
                    // 💡 활성화 상태 정의: 현재 인덱스가 활성화 개수(score)보다 작은지 확인
                    const isActive = index < score; 
                    return (
                        <img 
                            key={index} 
                            src={StarIcon} 
                            className="rating-icon"
                            // 💡 isActive 상태에 따라 opacity를 조절하는 인라인 스타일 적용
                            style={{ 
                                opacity: isActive ? 1 : 0.3 
                                // CSS 클래스로 제어하는 것이 더 권장되지만, 요구사항에 맞춰 인라인 스타일 사용
                            }}
                            alt={`Rating star ${index + 1}`}
                        />
                    );
                })}
            </div>
            <div className="rating-count-container">
                {/* 💡 포맷팅된 정수 값 사용 */}
                <span>({count})</span>
            </div>
        </div>
    );
}