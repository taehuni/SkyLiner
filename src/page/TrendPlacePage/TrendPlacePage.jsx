import react from 'react';
import { useNavigate } from 'react-router-dom';
import './TrendPlacePage.css';
import BackBtn from '../../assets/icon-back.svg';
export default function TrendPlacePage(){
    const navigate = useNavigate();
    const NavigatePage = () =>{ 
			navigate('/');//호출시 해당 react페이지로 이동
		};
    return(
        <div>
            <div className="header-container">
                <div className="header-btn-container">
                    <button aria-label="이전 페이지로" className="header-btn" onClick={NavigatePage}>
                        <img src={BackBtn}></img>
                    </button>
                </div>
                <div className="header-title">트렌드 모음</div>
            </div>
        </div>
    );
}
