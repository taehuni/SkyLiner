import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './Menubar.css';
import CloseIcon from '../../../assets/icon-close.svg';
import SettingIcon from '../../../assets/icon-setting.svg'


export default function Menubar({ menuCloseClick, navbarHeight, menubarVisible }){
		const navigate = useNavigate(); // 컴포넌트 최상위에서 훅을 먼저 호출, 변수에 담음.
		const nodeRef = useRef(null);
		const arguedStyle = {
			"--rendered-navbar-height" : `${navbarHeight}px`, //--rendered-navbar-height로 css 변수 등록 px단위.
		};
		const NavigatePage = () =>{ 
			navigate('/TrendPlace');//호출시 해당 react페이지로 이동
		};
		return(
			<CSSTransition
				in={menubarVisible}
				timeout={500}
				classNames="menubar-transition"
				mountOnEnter
				unmountOnExit
				nodeRef={nodeRef}
			>
			<div ref={nodeRef} className="view-container" style={arguedStyle}> {/*루트 요소에 ref를 연결*/}
				<div className="menubar-flex-wrapper">
					<div className="menubar-container">
						<div className="menubar-head">
							<span>SkyLiner</span>
							<button
								className="menubar-head-close-button"
								onClick={menuCloseClick}
								aria-label="닫기"
								>
								<img src={CloseIcon}></img>
							</button>
						</div>
						<div className="menubar-body">
							<div className="menubar-body-menu">
								<button aria-label="트렌드 모음 이동" onClick={NavigatePage}>트렌드 모음</button>
							</div>
						</div>
						<div className="menubar-tail">
							<button className="menubar-tail-admin-button" aria-label="관리자 페이지">
								<img src={SettingIcon}></img>
								<span>관리자 페이지</span>
							</button>
						</div>
					</div>
				</div>
				<div className="shadow-container" onClick={menuCloseClick}></div>

			</div>
			</CSSTransition>

		);

}


//CSSTransition의 DOM 노드 연결을 위해 React.forwardRef사용
/*const Menubar = forwardRef(function Menubar({ menuCloseClick, navbarHeight }, ref){
	const style = {
		"--rendered-navbar-height" : `${navbarHeight}px`, //--rendered-navbar-height로 css 변수 등록 px단위.
	};
	return (
		
		<div ref={ref} className="view-container" style={style}>
			<div className="menubar-flex-wrapper">
				<div className="menubar-container">
					<div className="menubar-head">
						<span>SkyLiner</span>
						<button
							className="menubar-head-close-button"
							onClick={menuCloseClick}
							aria-label="닫기"
							>
							<img src={CloseIcon}></img>
						</button>
					</div>
					<div className="menubar-body">
						<div className="menubar-body-menu">
							<button aria-label="트렌드 모음 이동">트렌드 모음</button>
						</div>
					</div>
					<div className="menubar-tail">
						<button className="menubar-tail-admin-button" aria-label="관리자 페이지">
							<img src={SettingIcon}></img>
							<span>관리자 페이지</span>
						</button>
					</div>
				</div>
			</div>
			<div className="shadow-container" onClick={menuCloseClick}></div>

		</div>
		);
});

export default Menubar;*/