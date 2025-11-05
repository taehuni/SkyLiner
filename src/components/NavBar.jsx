import SearchBtn from './SearchBtn.jsx';
import MenuBtn from './MenuBtn.jsx';
import '../styles/NavBar.css';

function SearchBtnArea() {
  return (
    <div className="search-btn-area" data-name="searchBtnArea">
      <div className="search-btn" data-name="searchBtn">
        <SearchBtn />
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="search-bar" data-name="searchBar">
      <div aria-hidden="true" className="search-bar-border" />
      <div className="search-bar-text">
        <p className="search-bar-placeholder">역 검색</p>
      </div>
    </div>
  );
}

function MenuBarArea() {
  return (
    <div className="menu-bar-area" data-name="menuBarArea">
      <SearchBar />
    </div>
  );
}

function MenuBtnArea({ onClick }) {
  return (
    <div className="menu-btn-area" data-name="menuBtnArea">
      <div 
        className="menu-btn" 
        data-name="menuBtn"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <MenuBtn />
      </div>
    </div>
  );
}

function NavBar({ onMenuClick }) {
  return (
    <nav className="navbar" data-name="navBar">
      <MenuBtnArea onClick={onMenuClick} />
      <MenuBarArea />
      <SearchBtnArea />
    </nav>
  );
}

export default NavBar;