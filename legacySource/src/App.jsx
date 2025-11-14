// 1. useState, useEffect, useRef 훅을 import
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import NavBar from './components/NavBar.jsx';
import BottomSheet from './components/BottomSheet.jsx';
import MenuBar from './components/MenuBar.jsx';
import AdminPage from './components/AdminPage.jsx';
import DetailPage from './components/DetailPage.jsx';
import { useMenuBarToggle } from './scripts/menuBarToggle.js';
import { useAdminModeToggle } from './scripts/adminModeToggle.js';
import { placesData } from './data/placesData.js';
import './styles/App.css';

// 1. (변경) react-svg-pan-zoom 대신 react-zoom-pan-pinch를 import
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import SvgMapComponent from './components/SvgMapComponent.jsx';

export default function App() {
  const { isMenuOpen, toggleMenu, closeMenu } = useMenuBarToggle();
  const { isAdminMode, enterAdminMode, exitAdminMode } = useAdminModeToggle();

  // 2. 동적 크기 계산을 위한 state 및 ref (기존과 동일)
  const [contentRect, setContentRect] = useState({ width: 0, height: 0 });
  const navBarRef = useRef(null);
  const bottomSheetHeadRef = useRef(null); 

  // 페이지 상태 관리 (기존과 동일)
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setCurrentPage('detail');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
    setSelectedPlace(null);
  };

  // 4. 동적 크기 계산을 위한 useEffect (기존과 동일)
  useEffect(() => {
    const calculateContentRect = () => {
      const navBarHeight = navBarRef.current ? navBarRef.current.offsetHeight : 0;
      const sheetHeadHeight = bottomSheetHeadRef.current ? bottomSheetHeadRef.current.offsetHeight : 0;
      
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight - navBarHeight - sheetHeadHeight;

      setContentRect({ width: availableWidth, height: availableHeight });
    };

    window.addEventListener('resize', calculateContentRect);
    calculateContentRect(); 

    // 컴포넌트 참조가 설정된 후 다시 계산
    const timer = setTimeout(calculateContentRect, 100); 

    return () => {
      window.removeEventListener('resize', calculateContentRect);
      clearTimeout(timer);
    }
  }, []); 

  // 5. (제거) react-svg-pan-zoom의 Pan 툴 설정을 위한 useEffect 제거
  /*
  React.useEffect(() => {
    if(Viewer.current){
      Viewer.current.changeTool(TOOL_PAN);
    }
  }, []);
  */

  // 관리자 페이지 (기존과 동일)
  if (isAdminMode) {
    return <AdminPage onBackClick={exitAdminMode} />;
  }

  // 디테일 페이지 (기존과 동일)
  if (currentPage === 'detail') {
    return <DetailPage place={selectedPlace} onBackClick={handleBackToMain} />;
  }

  // 메인 페이지
  return (
    <div className="main-base" data-name="mainBase">
      <MenuBar 
        isOpen={isMenuOpen} 
        onClose={closeMenu}
        onAdminClick={() => {
          enterAdminMode();
          closeMenu();
        }}
      />
      {/* 6. NavBar에 ref 전달 (기존과 동일) */}
      <NavBar ref={navBarRef} onMenuClick={toggleMenu} />
      
      {/* 7. BottomSheet에 headRef 전달 (기존과 동일) */}
      <BottomSheet 
        places={placesData} 
        onPlaceClick={handlePlaceClick}
        headRef={bottomSheetHeadRef} 
      />

      {/* 8. (수정) react-zoom-pan-pinch 적용 */}
      <div 
        style={{
          position: 'absolute',
          // NavBar 높이만큼 상단에서 밀어냄
          top: navBarRef.current ? navBarRef.current.offsetHeight : 0, 
          left: 0,
          width: contentRect.width,
          height: contentRect.height,
          zIndex: 0, // NavBar와 BottomSheet 뒤에 위치
          backgroundColor: '#f0f0f0' // 맵 배경색
        }}
      >
        {/* contentRect의 너비와 높이가 0보다 클 때만 렌더링하여 초기화 오류 방지 */}
        {contentRect.width > 0 && contentRect.height > 0 && (
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ mode: 'reset' }}
            limitToBounds={false}
            disablePadding={true}
            smooth={true}
          >
            <TransformComponent
              // 필요시 App.css에 스타일 정의
              wrapperClass="transform-wrapper"
              contentClass="transform-content"
            >
              {/* Pan/Zoom을 적용할 SvgMapComponent */}
              <SvgMapComponent />
              
            </TransformComponent>
          </TransformWrapper>
        )}
      </div>
    </div>
  );
}