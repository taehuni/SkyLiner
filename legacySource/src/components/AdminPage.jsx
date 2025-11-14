import React from 'react';
import '../styles/AdminPage.css';

function BackBtn({ onClick }) {
  return (
    <div 
      className="back-btn" 
      data-name="backBtn"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <svg 
        className="back-btn-icon"
        width="100%" 
        height="100%" 
        viewBox="0 0 12 24" 
        fill="none"
      >
        <path 
          d="M10 2L2 12L10 22" 
          stroke="#554638" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function AdminNavBar({ onBackClick }) {
  return (
    <div className="admin-navbar" data-name="adminNavBar">
      <div className="admin-nav-background"></div>
      <BackBtn onClick={onBackClick} />
      <h1 className="admin-title-text">Admin</h1>
    </div>
  );
}

function TempCell({ text }) {
  return (
    <div className="temp-cell" data-name="tempCell">
      <p className="temp-text">{text}</p>
    </div>
  );
}

function AdminContent() {
  return (
    <div className="admin-content" data-name="adminContent">
      <TempCell text="메트릭" />
      <TempCell text="로그 요약" />
      <TempCell text="유저 히트맵" />
    </div>
  );
}

function AdminPage({ onBackClick }) {
  return (
    <div className="admin-page" data-name="adminPage">
      <div className="admin-background"></div>
      <AdminNavBar onBackClick={onBackClick} />
      <AdminContent />
    </div>
  );
}

export default AdminPage;