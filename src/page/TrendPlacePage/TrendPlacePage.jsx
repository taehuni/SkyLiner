import react from 'react';
import { useNavigate } from 'react-router-dom';
import './TrendPlacePage.css';
import BackBtn from '../../assets/icon-back.svg';
import CardListWrapper from '../../components/common/CardList';
import { usePlaces } from '../../hooks/usePlaces';


export default function TrendPlacePage(){
    const navigate = useNavigate();
    const { places, loading, error } = usePlaces({ limit: 20 });

    const NavigatePage = () =>{ 
			navigate('/');//호출시 해당 react페이지로 이동
		};
    return (
      <div className="page-container">
        <div className="header-container">
          <div className="header-btn-container">
            <button
              aria-label="이전 페이지로"
              className="header-btn"
              onClick={NavigatePage}
            >
              <img className="header-btn-img" src={BackBtn}></img>
            </button>
          </div>
          <div className="header-title">트렌드 모음</div>
        </div>
        <div className="card-list-wrapper">
          {loading && <div>로딩 중...</div>}
          {error && <div>에러: {error}</div>}
          {!loading && !error && <CardListWrapper cardData={places} />}
        </div>
      </div>
    );
}
