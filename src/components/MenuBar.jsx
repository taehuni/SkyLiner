import React from 'react';
import '../styles/MenuBar.css';

function CloseBtn({ onClick }) {
  return (
    <div 
      className="close-btn" 
      data-name="closeBtn"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path 
          d="M18 6L6 18M6 6L18 18" 
          stroke="#554638" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function AdminBtn({ onClick }) {
  return (
    <div 
      className="admin-btn" 
      data-name="adminBtn"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="admin-btn-icon-left"></div>
      <p className="admin-btn-text">관리자모드</p>
    </div>
  );
}

function AdminBtnArea({ onClick }) {
  return (
    <div className="admin-btn-area" data-name="adminBtnArea">
      <AdminBtn onClick={onClick} />
    </div>
  );
}

function MenuCell({ text, isActive = false }) {
  return (
    <div className="menu-cell" data-name="menuCell">
      <div className={`menu-box ${isActive ? 'active' : ''}`} data-name="menuBox">
        <p className="menu-text">{text}</p>
      </div>
      <div className="divide-line" data-name="divideLine"></div>
    </div>
  );
}

function MenuArea() {
  return (
    <div className="menu-area" data-name="menuArea">
      <div className="menu-frame">
        <MenuCell text="트렌드 모음" isActive={true} />
        <MenuCell text="항목" isActive={false} />
      </div>
    </div>
  );
}

function MenuTitleArea({ onClose }) {
  return (
    <div className="menu-title-area" data-name="menuTitleArea">
      <div className="menu-bar-base"></div>
      <h1 className="menu-bar-title">SkyLiner</h1>
      <CloseBtn onClick={onClose} />
      <div className="divide-line-title" data-name="divideLineTitle"></div>
    </div>
  );
}

function MenuBarBase({ onAdminClick, onClose }) {
  return (
    <div className="menu-bar-base-container" data-name="menuBarBase">
      <div className="menu-bar-area" data-name="menuBarArea">
        <div className="menu-bar-background"></div>
        <MenuTitleArea onClose={onClose} />
        <MenuArea />
        <AdminBtnArea onClick={onAdminClick} />
      </div>
    </div>
  );
}

function MenuBarShadow({ onClick }) {
  return (
    <div 
      className="menu-bar-shadow" 
      data-name="menuBarShadow"
      onClick={onClick}
    ></div>
  );
}

function MenuBar({ isOpen, onClose, onAdminClick }) {
  return (
    <div className={`menu-bar-container ${isOpen ? 'open' : ''}`} data-name="menuBarContainer">
      <MenuBarShadow onClick={onClose} />
      <MenuBarBase onAdminClick={onAdminClick} onClose={onClose} />
    </div>
  );
}

export default MenuBar;