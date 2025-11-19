import react from 'react';
import { useNavigate } from 'react-router-dom';
import './TrendPlacePage.css';
export default function TrendPlacePage(){
    const navigate = useNavigate();
    const NavigatePage = () =>{ 
			navigate('/');//호출시 해당 react페이지로 이동
		};
    return(
        <div>
            <button aria-label="이전 페이지로" onClick={NavigatePage}>
                뒤로 가기
            </button>
        </div>
    );
}