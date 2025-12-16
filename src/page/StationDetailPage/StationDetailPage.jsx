import React, { useRef ,useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStationInfoLoader } from "../../scripts/useStationInfoLoader";
import getStationContent from "../../components/common/StationContent/StationContent";
import BackBtn from "../../assets/icon-back.svg";
import './StationDetailPage.css';


export default function StationDetailPage() {
    const ref = useRef(null)
    const location = useLocation();
    const stationCode = location?.state;
    const stationData = useStationInfoLoader(stationCode, "detail");
    //console.log(stationData, stationCode);
    const [navbarHeightValue, setNavbarHeight] = useState(0);
    const navigate = useNavigate();
    const NavigatePage = () =>{
        navigate('/');
    }
    const majorData = useMemo(() => {
      if (stationData) {
        return getStationContent(stationData, "detail", null)?.firstContent;
      }
    }, [stationData]);

    useEffect(() => {
      if (ref.current) {
        const renderedHeight = ref.current.offsetHeight;
        setNavbarHeight(renderedHeight);
      }
    }, [stationData, setNavbarHeight]);

  return (
    <>
      <div ref={ref} className="header-container">
        <div className="header-btn-container">
          <button
            aria-label="이전 페이지로"
            className="header-btn"
            onClick={NavigatePage}
          >
            <img className="header-btn-img" src={BackBtn}></img>
          </button>
        </div>
        <div className="header-title">
          {stationData?.stationName_kn
            ? `${stationData?.stationName_kn}역`
            : "역 정보 없음"}
        </div>
      </div>
      <div className="body-container" style={{ top: `${navbarHeightValue}px` }}>
        <div className="body-img-wrapper">
          <img src={stationData?.imageLink} className="body-img" />
        </div>
        <div className="body-stationInfo">{majorData ?? "정보 없음"}</div>
      </div>
    </>
  );
}
