// Navbar.jsx
import React, { useRef, useEffect } from 'react';
import './Navbar.css';
import MenuIcon from '../../../assets/icon-menu.svg';
import SearchIcon from '../../../assets/icon-search.svg';

//App.jsx로 부터 받은 콜백 함수 OnHeightCalc로 높이 계산후 전달함
export default function Navbar({ onHeightCalc, menuOpenClick }){
  const ref = useRef(null);
  useEffect(() => {
    if(ref.current){
      const renderedHeight = ref.current.offsetHeight; //렌더링된 높이 측정
      onHeightCalc(renderedHeight);//부모의 콜백 함수로 실제 렌더링된 높이 전달
    }
  }, [onHeightCalc]);//onHeightCalc가 변경 될 때 마다 실행

  return (
    <header ref={ref} className="navbar-container">{/*높이 측정할 요소에 ref속성으로 ref 연결*/}
      <button 
        className="nav-icon-container icon-container-left"
        aria-label="메뉴"
        onClick={menuOpenClick}
      >
        <img src={MenuIcon} className="nav-icon-menu"></img>
      </button>
      <div className="search-box-container">
        <form>
        <input type="text" placeholder="역 검색" />
      </form>
      </div>
      <button className="nav-icon-container icon-container-right" aria-label="설정">
         <img src={SearchIcon} className="nav-icon-search"></img>
      </button>
    </header>
  );
};
