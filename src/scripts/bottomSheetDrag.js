import { useState, useRef, useEffect } from 'react';

/**
 * 바텀시트 드래그 인터랙션을 관리하는 커스텀 훅
 * @returns {Object} 드래그 관련 state, ref, 핸들러
 */
export function useBottomSheetDrag() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragStartY, setDragStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [maxDragDistance, setMaxDragDistance] = useState(0);
  const sheetRef = useRef(null);
  const headRef = useRef(null);

  // 바텀시트의 최대 드래그 거리 계산
  useEffect(() => {
    if (sheetRef.current) {
      const sheetHeight = sheetRef.current.offsetHeight;
      const headHeight = 40; // 2.5rem = 40px
      setMaxDragDistance(sheetHeight - headHeight);
    }
  }, []);

  const handleMouseDown = (e) => {
    // 마우스와 터치 이벤트 모두 처리
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setCurrentY(0);
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (dragStartY === null) return;
    
    // 터치 이벤트의 경우 기본 스크롤 동작 방지
    if (e.type === 'touchmove') {
      e.preventDefault();
    }
    
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = dragStartY - clientY;
    
    // 최소 10px 이상 움직여야 드래그로 인식 (확실히 드래그했을 때만)
    if (Math.abs(deltaY) > 10 && !isDragging) {
      setIsDragging(true);
    }
    
    // 드래그로 인식되지 않았으면 움직이지 않음
    if (!isDragging && Math.abs(deltaY) <= 10) {
      return;
    }
    
    let newY = deltaY;
    
    // 축소 상태에서 위로 드래그: 0 이상, maxDragDistance 이하로 제한
    if (!isExpanded) {
      if (newY < 0) {
        // 아래로 드래그하는 것 방지
        newY = 0;
      } else if (newY > maxDragDistance) {
        // 바텀시트가 완전히 올라온 상태 이상으로 드래그되지 않도록
        newY = maxDragDistance;
      }
    } 
    // 확장 상태에서 아래로 드래그: 0 이하로만 제한
    else {
      if (newY > 0) {
        // 위로 드래그하는 것 방지
        newY = 0;
      } else if (newY < -maxDragDistance) {
        // 너무 아래로 내려가지 않도록
        newY = -maxDragDistance;
      }
    }
    
    setCurrentY(newY);
  };

  const handleMouseUp = () => {
    if (dragStartY === null) return;
    
    // 드래그가 아닌 단순 클릭이면 아무 동작도 하지 않음
    if (!isDragging) {
      setDragStartY(null);
      setCurrentY(0);
      setIsDragging(false);
      return;
    }
    
    // 50px 이상 위로 드래그하면 확장
    if (currentY > 50) {
      setIsExpanded(true);
    } else if (currentY < -50) {
      setIsExpanded(false);
    }
    
    setDragStartY(null);
    setCurrentY(0);
    setIsDragging(false);
  };

  useEffect(() => {
    if (dragStartY !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [dragStartY, currentY, isDragging, isExpanded, maxDragDistance]);

  /**
   * 드래그 상태에 따라 transform 스타일 값을 계산
   * @returns {string} transform CSS 값
   */
  const getTransformStyle = () => {
    if (dragStartY !== null && isDragging) {
      if (isExpanded) {
        // 확장 상태: 아래로 내리기 (currentY는 음수이므로 절대값)
        return `translateY(${Math.abs(currentY)}px)`;
      } else {
        // 축소 상태: 위로 올리기
        return `translateY(calc(100% - 2.5rem - ${currentY}px))`;
      }
    }
    return '';
  };

  return {
    // State
    isExpanded,
    isDragging,
    
    // Refs
    sheetRef,
    headRef,
    
    // Handlers
    handleMouseDown,
    
    // Computed
    getTransformStyle,
  };
}