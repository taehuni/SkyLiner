import React, { useState, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import Menubar from './Menubar.jsx';
import '../styles/menubar-wrapper.css';

export default function MenubarWrap({ menuCloseClick, navbarHeight, menubarVisible }){
	/*const [menubarVisible, setMenubarVisible] = useState(false);//메뉴바 표시 상태 관리. 기본값 false
	
	const openMenu = () => {//Navbar에서 메뉴 버튼 클릭 시 호출될 토글 함수
    setMenubarVisible(true);
  };

  const closeMenu = () => {
    setMenubarVisible(false);
  };*/
	const nodeRef = useRef(null);
	//console.log(menubarVisible)
	return (
		<CSSTransition
          in={menubarVisible}
          timeout={500}
          classNames="menu-transition"
          mountOnEnter
          unmountOnExit
          nodeRef={nodeRef}
        >
          <Menubar 
            ref={nodeRef}
            menuCloseClick={menuCloseClick}
            navbarHeight={navbarHeight}
          />
        </CSSTransition>
		);
}