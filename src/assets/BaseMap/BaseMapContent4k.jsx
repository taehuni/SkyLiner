import React, { useRef, useEffect } from "react";
function isCircle(obj) {
  if (obj.target.tagName.toLowerCase() === "circle") {
    return true;
  } else {
    return false;
  }
}
export default function BaseMapContent4k({ onNodeClick }) {
  const preset = {
    nodeDefaultColor: "#F8F5E6",
    nodeHoverColor: "#37FF00",
    nodeDownColor: "#FFE356",
  };
  const handleMouseDown = (e) => {
    if (isCircle(e)) {
      const id = e.target.getAttribute("id").substr(13);
      //console.log(id);
      e.target.style.fill = preset.nodeDownColor;
      if (onNodeClick) {
        //부모 콜백 함수에 id 전달
        onNodeClick(id);
      }
    }
  };
  const handleMouseUp = (e) => {
    if (isCircle(e)) e.target.style.fill = preset.nodeHoverColor;
  };
  const handleMouseOver = (e) => {
    if (isCircle(e)) e.target.style.fill = preset.nodeHoverColor;
  };
  const handleMouseOut = (e) => {
    if (isCircle(e)) e.target.style.fill = preset.nodeDefaultColor;
  };
  //기존의 이벤트 리스너. circle 태그에 직접 등록.
  /*
  const nodeGroup = useRef(null);
  console.log(preset[0]);
  useEffect(()=>{
    const nodeGroupElement = nodeGroup.current;
    if(nodeGroupElement){
      const circleElements = nodeGroupElement.querySelectorAll("circle");

      const handleMouseOver = (e) => {
        const target = e.target;
        target.style.fill = preset.nodeHoverColor;
      };

      const handleMouseOut = (e) => {
        const target = e.target;
        target.style.fill = preset.nodeDefaultColor;
        
      };
      const handleMouseDown = (e) => {
        const target = e.target;
        //console.log(e);
        target.style.fill = preset.nodeDownColor;
        const nodeId = target.id.substr(13);
        if(onNodeClick){
          onNodeClick(nodeId);//e가 해당 tag name으로 들어옴.
        }
      };

      const handleMouseUp = (e) => {
        const target = e.target;
        target.style.fill = preset.nodeHoverColor;
      };

      circleElements.forEach(c => {
        c.addEventListener('mouseover', handleMouseOver);
        c.addEventListener('mouseout', handleMouseOut);
        c.addEventListener('mousedown', handleMouseDown);
        c.addEventListener('mouseup', handleMouseUp);
      });

      return () => {
        circleElements.forEach(c => {
          c.removeEventListener('mouseover', handleMouseOver);
          c.removeEventListener('mouseout', handleMouseOut);
          c.removeEventListener('mousedown', handleMouseDown);
          c.removeEventListener('mouseup', handleMouseUp);
        })
      }
    };
  }, []);*/

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2560"
      height="1887"
      fill="none"
      viewBox="0 0 2560 1887"
    >
      <g id="Base_map">
        <path fill="#FDFCF8" d="M0 0h2560v1887H0z"></path>
        <g id="path" strokeWidth="25">
          <path
            id="marunouchi_SubLine"
            stroke="#B90C0C"
            d="m663.271 984.294-277.839-.784"
          ></path>
          <path
            id="marunouchi_MainLine"
            stroke="#B90C0C"
            d="m432.849 769.449 204.592 209.243a19.6 19.6 0 0 0 14.01 5.896h286.963a19.6 19.6 0 0 1 14.05 5.937l49.596 51.025c3.68 3.79 8.75 5.93 14.05 5.93h173.65c5.2 0 10.19 2.07 13.86 5.75l328.67 328.95c3.68 3.68 8.66 5.74 13.86 5.74h290.28c5.16 0 10.1-2.03 13.77-5.65l28.33-27.98c3.72-3.68 5.82-8.7 5.82-13.94v-77c0-5.17-2.04-10.13-5.68-13.8l-99.08-99.87a19.6 19.6 0 0 0-13.91-5.8h-68.55c-8.65 0-15.67-7.01-15.67-15.67V815.904c0-5.216-2.08-10.217-5.78-13.895l-89.1-88.582a19.61 19.61 0 0 0-13.82-5.698h-162.22c-5.18 0-10.16-2.057-13.83-5.72l-93.95-93.681a19.57 19.57 0 0 0-13.83-5.72H983.824"
          ></path>
          <path
            id="hibiya_MainLine"
            stroke="#B5B5AC"
            d="M741.646 1459.44h764.894c5.17 0 10.14-2.05 13.81-5.7l115.99-115.28c3.67-3.64 8.64-5.69 13.82-5.69h404.46c21.64 0 39.19-17.55 39.19-39.19v-269.9c0-5.03-1.94-9.87-5.41-13.52l-24.27-25.47a19.57 19.57 0 0 0-14.18-6.079h-151.16c-5.4 0-10.56-2.229-14.26-6.162l-44.03-46.764a19.6 19.6 0 0 1-5.33-13.431V481.82c0-5.267 2.12-10.313 5.89-13.999l106.25-104.05a19.62 19.62 0 0 1 13.71-5.594h118.88"
          ></path>
        </g>
        <g
          id="stationNode"
          fill="#F8F5E6"
          strokeWidth="2.939"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          <circle
            id="station_node_Mb03"
            cx="385.432"
            cy="983.51"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_Mb04"
            cx="468.313"
            cy="983.51"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_Mb05"
            cx="553.546"
            cy="983.51"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M01"
            cx="435.787"
            cy="770.331"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M02"
            cx="474.975"
            cy="812.653"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M03"
            cx="514.163"
            cy="854.192"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M04"
            cx="553.546"
            cy="896.514"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M05"
            cx="594.496"
            cy="935.702"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M06"
            cx="643.677"
            cy="983.51"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M07"
            cx="749.287"
            cy="983.51"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M08"
            cx="854.897"
            cy="984.686"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M09"
            cx="968.345"
            cy="1008"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M10"
            cx="1036.14"
            cy="1047.19"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M11"
            cx="1117.06"
            cy="1047.19"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M12"
            cx="1197.98"
            cy="1047.19"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M13"
            cx="1373.54"
            cy="1226.08"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M14"
            cx="1470.33"
            cy="1321.7"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M17"
            cx="1817.54"
            cy="1186.7"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M18"
            cx="1682.14"
            cy="1095.19"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M19"
            cx="1682.14"
            cy="885.346"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M20"
            cx="1682.14"
            cy="808.734"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M21"
            cx="1558.9"
            cy="708.61"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M22"
            cx="1405.09"
            cy="708.61"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M23"
            cx="1240.5"
            cy="603.393"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M24"
            cx="1130.58"
            cy="603.393"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_M25"
            cx="984.215"
            cy="603.393"
            r="18.124"
            stroke="#B90C0C"
          ></circle>
          <circle
            id="station_node_H01"
            cx="742.037"
            cy="1459.44"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H02"
            cx="861.362"
            cy="1459.44"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H03"
            cx="1018.31"
            cy="1459.44"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H04"
            cx="1212.29"
            cy="1459.44"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H05"
            cx="1420.57"
            cy="1459.44"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H06"
            cx="1515.87"
            cy="1456.88"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H07_M15"
            cx="1586.87"
            cy="1387.38"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H08"
            cx="1752.88"
            cy="1333.06"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H09_M16"
            cx="1884.37"
            cy="1332.38"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H10"
            cx="2037.18"
            cy="1333.06"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H11"
            cx="2094.59"
            cy="1298.58"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H12"
            cx="2094.59"
            cy="1194.93"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H13"
            cx="2094.59"
            cy="1104.01"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H14"
            cx="2039.14"
            cy="978.416"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H15"
            cx="1861.03"
            cy="947.066"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H16"
            cx="1834.78"
            cy="890.636"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H17"
            cx="1834.78"
            cy="692.544"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H18"
            cx="1834.78"
            cy="568.32"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H19"
            cx="1834.78"
            cy="479.756"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H20"
            cx="1878.67"
            cy="432.144"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H21"
            cx="1930.79"
            cy="381.395"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
          <circle
            id="station_node_H22"
            cx="2080.29"
            cy="357.883"
            r="18.124"
            stroke="#B5B5AC"
          ></circle>
        </g>
        <g
          id="stationName"
          fill="#000"
          fontFamily="Arial"
          fontSize="18"
          letterSpacing="0em"
        >
          <text
            xmlSpace="preserve"
            id="station_name_H01"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1643.997 1803.972)"
          >
            <tspan x="0" y="16.74">
              나카메구로
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H02"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1584.497 1967.447)"
          >
            <tspan x="0" y="16.74">
              에비스
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H03"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1505.996 2183.126)"
          >
            <tspan x="0" y="16.74">
              히로오
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H04"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1408.996 2449.631)"
          >
            <tspan x="0" y="16.74">
              롯폰기
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H05"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1304.746 2736.056)"
          >
            <tspan x="0" y="16.74">
              가미야초
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H06"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1257.746 2865.187)"
          >
            <tspan x="0" y="16.74">
              토라노몬
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H07"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1122.837 2928.096)"
          >
            <tspan x="0" y="16.74">
              카스미가세키
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H08"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1727.77" y="1305.53">
              히비야
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H09"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -898.531 3309.283)"
          >
            <tspan x="0" y="16.74">
              긴자
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H10"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -822.031 3519.465)"
          >
            <tspan x="0" y="16.74">
              히가시긴자
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H11"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="2127.77" y="1305.53">
              츠키지
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H12"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="2127.77" y="1201.53">
              핫쵸보리
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H13"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="2127.77" y="1110.53">
              카야바쵸
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H14"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="2014.27" y="953.53">
              닌교초
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H15"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1897.77" y="943.03">
              코덴마쵸
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H16"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1868.27" y="897.53">
              아키하바라
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H17"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1868.27" y="699.53">
              나카오카치마치
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H18"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1868.27" y="575.03">
              우에노
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H19"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1750.77" y="486.53">
              이리야
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H20"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1809.77" y="409.03">
              미노와
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H21"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1828.27" y="358.03">
              미나미센쥬
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_H22"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="2046.77" y="401.03">
              키타센쥬
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M01"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="474.771" y="766.53">
              오기쿠보
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M02"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="514.271" y="809.03">
              미나미아사가야
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M03"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="553.771" y="850.53">
              신코엔지
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M04"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="594.271" y="892.53">
              히가시코엔지
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M05"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="643.771" y="932.03">
              신나카노
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M06"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1046.216 1433.16)"
          >
            <tspan x="0" y="16.74">
              나카노사카우에
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M07"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -993.466 1578.089)"
          >
            <tspan x="0" y="16.74">
              니시신주쿠
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M08"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -940.716 1723.018)"
          >
            <tspan x="0" y="16.74">
              신주쿠
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M09"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1001.77" y="1004.03">
              신주쿠산초메
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M10"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -931.016 2001.853)"
          >
            <tspan x="0" y="16.74">
              신주쿠교엔마에
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M11"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -890.516 2113.126)"
          >
            <tspan x="0" y="16.74">
              요츠야산초메
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M12"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1233.27" y="1047.53">
              요츠야
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M13"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1409.27" y="1222.53">
              아카사카미츠케
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M14"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1501.27" y="1318.03">
              콧카이기지도마에
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M17"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1853.77" y="1183.03">
              도쿄
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M18"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1714.77" y="1102.03">
              오테마치
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M19"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1714.77" y="892.03">
              아와지초
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M20"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="1714.77" y="815.53">
              오차노미즈
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M21"
            style={{ whiteSpace: "pre" }}
            transform="translate(1517.27 660.79)"
          >
            <tspan x="0" y="16.74">
              혼고산초메
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M22"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -285.626 2341.013)"
          >
            <tspan x="0" y="16.74">
              코라쿠엔
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M23"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -218.826 2060.783)"
          >
            <tspan x="0" y="16.74">
              묘가다니
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M24"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -273.826 1909.671)"
          >
            <tspan x="0" y="16.74">
              신오츠카
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_M25"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -347.076 1708.419)"
          >
            <tspan x="0" y="16.74">
              이케부쿠로
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_Mb03"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1175.216 1078.735)"
          >
            <tspan x="0" y="16.74">
              호난초
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_Mb04"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1133.966 1192.068)"
          >
            <tspan x="0" y="16.74">
              나카노후지미초
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_name_Mb05"
            style={{ whiteSpace: "pre" }}
            transform="rotate(40 -1091.966 1307.462)"
          >
            <tspan x="0" y="16.74">
              나카노신바시
            </tspan>
          </text>
        </g>
        <g
          id="stationTitle"
          fontFamily="Arial"
          fontSize="20"
          letterSpacing="0em"
        >
          <text
            xmlSpace="preserve"
            id="station_title_hibiya"
            fill="#9A9A92"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="704.771" y="1426.22">
              히비야선
            </tspan>
          </text>
          <text
            xmlSpace="preserve"
            id="station_title_hibiya_2"
            fill="#B90C0C"
            style={{ whiteSpace: "pre" }}
          >
            <tspan x="380.771" y="730.223">
              마루노우치선
            </tspan>
          </text>
        </g>
      </g>
    </svg>
  );
}
