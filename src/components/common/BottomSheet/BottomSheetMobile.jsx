import React, { Children, useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useBottomSheet } from './useBottomSheet.js';
import { useBodyScrollLock } from '../../../scripts/useBodyScrollLock.js';
import './BottomSheetMobile.css';

export default function BottomSheetMobile({
  isOpen,
  contentData,
  sheetMode,
  setSheetMode,
}) {
  //const isDesktop = useMediaQuery({ query: '(min0width: 1024px)' });
  // useBottomSheet.js에 sheet의 높이, 헤더 높이 전달
  const { firstContent, secondContent } = contentData || {};

  const {
    sheetRef,
    headerRef,
    firstRowRef, // 첫 줄 측정용 ref
    sheetHeight,
    controls,
    y,
    isDesktop,
    handleDragEnd,
    SNAP_POINTS,
    dragControls,
  } = useBottomSheet({ sheetMode, setSheetMode });

  //console.log("currentY:", y);
  useBodyScrollLock(isOpen);

  return (
    <motion.div
      ref={sheetRef}
      className="bottomsheet-container"
      //data-is-desktop={isDesktop}
      style={{
        y,
        visibility: sheetHeight === 0 ? "hidden" : "visible",
        //height: isDesktop ? '100%' : 'auto', //모바일인 경우 높이 auto, 데스크톱은 100%
        maxHeight: "90vh",
        //display: isDesktop ? 'none' : 'flex',
      }} // 모바일 높이 설정
      animate={controls}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 250,
      }}
      drag="y" // desktop에서만 드래그 활성화
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{
        //드래그 범위 제한
        top: 0,
        bottom: SNAP_POINTS.COLLAPSED,
      }}
      dragElastic={0.1} //고무줄 효과
      onDragEnd={handleDragEnd} //드래그 끝나는 순간에만 높이 결정
    >
      <div
        ref={headerRef}
        className="bottomsheet-header-container"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div></div>
      </div>
      <div className="bottomsheet-body-container">
        <div ref={firstRowRef} className="body-first-container">
          {firstContent}
        </div>
        <div className="body-second-container">{secondContent}</div>
      </div>
    </motion.div>
  );
}
