import SearchIconSVG from "../source/search-icon.svg";
import MenuIconSVG from "../source/menu-icon.svg";
import '../styles/MainBase.css';
import '../styles/SearchBtn.css';
import '../styles/MenuBtn.css';

function SearchBtn() {
  return (
    <div className="search-btn-icon" data-name="searchBtn">
      <img src={SearchIconSVG} alt="Search" className="svg-full" />
    </div>
  );
}

function SearchBtnArea() {
  return (
    <div className="search-btn-area-main" data-name="searchBtnArea">
      <SearchBtn />
    </div>
  );
}

function SearchBar() {
  return (
    <div className="search-bar-main" data-name="searchBar">
      <div aria-hidden="true" className="search-bar-border-main" />
      <div className="search-bar-text-main">
        <p className="search-bar-placeholder-main">역 검색</p>
      </div>
    </div>
  );
}

function MenuBarArea() {
  return (
    <div className="menu-bar-area-main" data-name="menuBarArea">
      <SearchBar />
    </div>
  );
}

function MenuBtn() {
  return (
    <div className="menu-btn-icon" data-name="menuBtn">
      <img src={MenuIconSVG} alt="Menu" className="svg-full" />
    </div>
  );
}

function MenuBtnArea() {
  return (
    <div className="menu-btn-area-main" data-name="menuBtnArea">
      <MenuBtn />
    </div>
  );
}

function NavBar() {
  return (
    <div className="navbar-main" data-name="navBar">
      <SearchBtnArea />
      <MenuBarArea />
      <MenuBtnArea />
    </div>
  );
}

export default function MainBase() {
  return (
    <div className="main-base-container" data-name="mainBase">
      <NavBar />
    </div>
  );
}