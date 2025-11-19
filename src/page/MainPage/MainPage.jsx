import react, { useState, useCallback, useRef } from 'react';
import Navbar from '../../components/common/Navbar/';
import Menubar from '../../components/common/Menubar/';
import BottomSheet from '../../components/common/BottomSheet';
import { StoreSummary, StoreDetails } from '../../components/sampleData/StoreInfo.jsx';
import './MainPage.css';

export default function MainPage(){
    const [menubarVisible, setMenubarVisible] = useState(false);//메뉴바 표시 상태 관리. 기본값 false
    const [navbarHeightValue, setNavbarHeight] = useState(0);//네비게이션 바 높이 저장할 상태 배열. 초기값 0
    const nodeRef = useRef(null);
    const heightHandleMeasure = useCallback((height) => {//높이 측정시 호출 할 callback함수
    setNavbarHeight(height);//네비게이션 바 높이를 상태에 업데이트 
    }, []);
    const openMenu = () => {//Navbar에서 메뉴 버튼 클릭 시 호출될 토글 함수
    setMenubarVisible(true);
    };

    const closeMenu = () => {
    setMenubarVisible(false);
    };
    return(
            <>
                  <div>
                    {/*
                    <StationBottomSheet navbarHeight={navbarHeightValue}/>
                    <BottomSheetWrapper navbarHeight={navbarHeightValue}/>
                    */}
                    <Navbar
                    onHeightCalc={heightHandleMeasure}/*핸들러 함수 전달*/
                    menuOpenClick={openMenu}
                    />
                    {/* 기존 방식. menubarVisible의 true/false에 따라 컴포넌트 조건 렌더링*/}
                    {/*{
                      menubarVisible && 
                      <Menubar 
                        menuCloseClick={closeMenu}
                        navbarHeight={navbarHeightValue}
                      />
                    }*/} 
                   
                    {/*react-transition-group 사용*/}
                    
                    {/*<CSSTransition
                      in={menubarVisible}
                      timeout={300}
                      classNames="menu"
                      mountOnEnter
                      unmountOnExit
                      nodeRef={nodeRef}
                    >
                      <Menubar 
                        ref={nodeRef}
                        menuCloseClick={closeMenu}
                        navbarHeight={navbarHeightValue}
                      />
                    </CSSTransition>*/}
            
                  </div>
                  <BottomSheet
                    // 1단 내용물 (요약)
                    firstContent={<StoreSummary />}
                    secondContent={<StoreDetails />}
                  />
                  <Menubar
                    className="menubar-wrapper"
                    menuCloseClick={closeMenu}
                    navbarHeight={navbarHeightValue}
                    menubarVisible={menubarVisible}
                  />
            
                </>
        
    );
}