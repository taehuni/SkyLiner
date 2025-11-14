
export default function SvgMapComponent({ width, height }) {
  const isTargetElement = (id) => {
    return id && (id.startsWith("station_node_") || id.startsWith("station_code_"));
  };
  const handleMouseDown = (e) => {
    const target = e.target;
    if (isTargetElement(target.id)) {
      target.setAttribute("fill", "#ff9999");
    }
  };

  const handleMouseUp = (e) => {
    const target = e.target;
    if (isTargetElement(target.id)) {
      // (stopPropagation 제거)
      target.setAttribute("fill", "#F8F5E6");
    }
  };

  return (
  <svg
    width={3845}
    height={2837}
    viewBox="0 0 3845 2837"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
  >
    <g id="Base_map">
      <rect width={3844.65}
        height={2836.68} fill="#FDFCF8" />
      <g id="Group 3">
        <g id="path">
          <path
            id="marunouchi_SubLine"
            d="M721.555 1552.98L165.877 1551.42"
            stroke="#B90C0C"
            strokeWidth={24.2962}
          />
          <path
            id="marunouchi_MainLine"
            d="M260.711 1123.29L669.896 1541.78C677.269 1549.32 687.369 1553.57 697.915 1553.57H1271.84C1282.43 1553.57 1292.56 1557.85 1299.94 1565.45L1399.12 1667.49C1406.5 1675.08 1416.64 1679.36 1427.22 1679.36H1774.54C1784.94 1679.36 1794.91 1683.5 1802.26 1690.85L2459.6 2348.76C2466.95 2356.11 2476.92 2360.24 2487.32 2360.24H3067.88C3078.19 2360.24 3088.08 2356.18 3095.42 2348.94L3152.07 2292.98C3159.52 2285.62 3163.71 2275.58 3163.71 2265.1V2111.09C3163.71 2100.75 3159.63 2090.83 3152.35 2083.49L2954.19 1883.75C2946.84 1876.34 2936.82 1872.17 2926.37 1872.17H2789.28C2771.96 1872.17 2757.93 1858.13 2757.93 1840.82V1216.2C2757.93 1205.77 2753.77 1195.77 2746.37 1188.41L2568.17 1011.25C2560.82 1003.95 2550.89 999.854 2540.54 999.854H2216.1C2205.73 999.854 2195.78 995.74 2188.43 988.414L2000.54 801.052C1993.2 793.727 1983.25 789.613 1972.87 789.613H1362.66"
            stroke="#B90C0C"
            strokeWidth={24.2962}
          />
          <path
            id="hibiya_MainLine"
            d="M878.305 2503.28H2408.09C2418.44 2503.28 2428.37 2499.18 2435.71 2491.89L2667.7 2261.32C2675.04 2254.03 2684.97 2249.93 2695.32 2249.93H3504.25C3547.54 2249.93 3582.63 2214.84 3582.63 2171.56V1631.75C3582.63 1621.69 3578.76 1612.01 3571.81 1604.72L3523.28 1553.78C3515.89 1546.01 3505.63 1541.62 3494.91 1541.62H3192.6C3181.79 1541.62 3171.47 1537.16 3164.06 1529.29L3076.01 1435.77C3069.17 1428.5 3065.35 1418.89 3065.35 1408.9V548.037C3065.35 537.502 3069.6 527.41 3077.12 520.038L3289.64 311.938C3296.97 304.767 3306.81 300.75 3317.06 300.75H3554.81"
            stroke="#B5B5AC"
            strokeWidth={24.2962}
          />
        </g>
        <g id="marunouchi">
          <circle
            id="station_node_Mb03"
            cx={165.877}
            cy={1551.42}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_Mb03"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={138.893} y={1558.1}>
              {"Mb03"}
            </tspan>
          </text>
          <circle
            id="station_node_Mb04"
            cx={331.64}
            cy={1551.42}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_Mb04"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={303.526} y={1558.1}>
              {"Mb04"}
            </tspan>
          </text>
          <circle
            id="station_node_Mb05"
            cx={502.105}
            cy={1551.42}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_Mb05"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={474.662} y={1558.1}>
              {"Mb05"}
            </tspan>
          </text>
          <circle
            id="station_node_M01"
            cx={266.589}
            cy={1125.06}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M01"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={246.677} y={1131.74}>
              {"M01"}
            </tspan>
          </text>
          <circle
            id="station_node_M02"
            cx={344.964}
            cy={1209.7}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M02"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={323.674} y={1216.39}>
              {"M02"}
            </tspan>
          </text>
          <circle
            id="station_node_M03"
            cx={423.339}
            cy={1292.78}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M03"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={402.397} y={1299.47}>
              {"M03"}
            </tspan>
          </text>
          <circle
            id="station_node_M04"
            cx={502.105}
            cy={1377.42}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M04"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={480.035} y={1384.11}>
              {"M04"}
            </tspan>
          </text>
          <circle
            id="station_node_M05"
            cx={584.007}
            cy={1455.8}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M05"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={562.607} y={1462.49}>
              {"M05"}
            </tspan>
          </text>
          <circle
            id="station_node_M06"
            cx={682.367}
            cy={1551.42}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M06"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={660.297} y={1558.1}>
              {"M06"}
            </tspan>
          </text>
          <circle
            id="station_node_M07"
            cx={893.587}
            cy={1551.42}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M07"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={872.15} y={1558.1}>
              {"M07"}
            </tspan>
          </text>
          <circle
            id="station_node_M08"
            cx={1104.81}
            cy={1553.77}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M08"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1082.99} y={1560.45}>
              {"M08"}
            </tspan>
          </text>
          <circle
            id="station_node_M09"
            cx={1331.7}
            cy={1600.4}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M09"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1309.6} y={1607.09}>
              {"M09"}
            </tspan>
          </text>
          <circle
            id="station_node_M10"
            cx={1467.29}
            cy={1678.78}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M10"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1447.38} y={1685.46}>
              {"M10"}
            </tspan>
          </text>
          <circle
            id="station_node_M11"
            cx={1629.14}
            cy={1678.78}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M11"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1611.38} y={1685.46}>
              {"M11"}
            </tspan>
          </text>
          <circle
            id="station_node_M12"
            cx={1790.98}
            cy={1678.78}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M12"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1771.85} y={1685.46}>
              {"M12"}
            </tspan>
          </text>
          <circle
            id="station_node_M13"
            cx={2142.1}
            cy={2036.56}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M13"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2123.32} y={2043.24}>
              {"M13"}
            </tspan>
          </text>
          <circle
            id="station_node_M14"
            cx={2335.68}
            cy={2227.79}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M14"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2315.77} y={2234.48}>
              {"M14"}
            </tspan>
          </text>
          <circle
            id="station_node_M17"
            cx={3030.09}
            cy={1957.79}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M17"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3010.81} y={1964.48}>
              {"M17"}
            </tspan>
          </text>
          <circle
            id="station_node_M18"
            cx={2759.3}
            cy={1774.78}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M18"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2739.65} y={1781.47}>
              {"M18"}
            </tspan>
          </text>
          <circle
            id="station_node_M19"
            cx={2759.3}
            cy={1355.09}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M19"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2739.35} y={1361.77}>
              {"M19"}
            </tspan>
          </text>
          <circle
            id="station_node_M20"
            cx={2759.3}
            cy={1201.86}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M20"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2738.01} y={1208.55}>
              {"M20"}
            </tspan>
          </text>
          <circle
            id="station_node_M21"
            cx={2512.81}
            cy={1001.62}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M21"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2493.68} y={1008.3}>
              {"M21"}
            </tspan>
          </text>
          <circle
            id="station_node_M22"
            cx={2205.19}
            cy={1001.62}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M22"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2184.68} y={1008.3}>
              {"M22"}
            </tspan>
          </text>
          <circle
            id="station_node_M23"
            cx={1876.02}
            cy={791.181}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M23"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1855.86} y={797.868}>
              {"M23"}
            </tspan>
          </text>
          <circle
            id="station_node_M24"
            cx={1656.17}
            cy={791.181}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M24"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1634.89} y={797.868}>
              {"M24"}
            </tspan>
          </text>
          <circle
            id="station_node_M25"
            cx={1363.44}
            cy={791.181}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B90C0C"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_M25"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1342.83} y={797.868}>
              {"M25"}
            </tspan>
          </text>
        </g>
        <g id="hibiya">
          <circle
            id="station_node_H01"
            cx={879.088}
            cy={2503.28}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H01"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={860.912} y={2509.97}>
              {"H01"}
            </tspan>
          </text>
          <circle
            id="station_node_H02"
            cx={1117.74}
            cy={2503.28}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H02"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1098.19} y={2509.97}>
              {"H02"}
            </tspan>
          </text>
          <circle
            id="station_node_H03"
            cx={1431.63}
            cy={2503.28}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H03"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1412.43} y={2509.97}>
              {"H03"}
            </tspan>
          </text>
          <circle
            id="station_node_H04"
            cx={1819.59}
            cy={2503.28}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H04"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1799.25} y={2509.97}>
              {"H04"}
            </tspan>
          </text>
          <circle
            id="station_node_H05"
            cx={2236.15}
            cy={2503.28}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H05"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2216.48} y={2509.97}>
              {"H05"}
            </tspan>
          </text>
          <circle
            id="station_node_H06"
            cx={2442.27}
            cy={2503.28}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H06"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2421.94} y={2509.97}>
              {"H06"}
            </tspan>
          </text>
          <circle
            id="station_node_H08"
            cx={2900.77}
            cy={2250.52}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H08"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2880.69} y={2257.21}>
              {"H08"}
            </tspan>
          </text>
          <circle
            id="station_node_H10"
            cx={3469.38}
            cy={2250.52}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H10"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3451.2} y={2257.21}>
              {"H10"}
            </tspan>
          </text>
          <circle
            id="station_node_H11"
            cx={3584.2}
            cy={2181.55}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H11"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3568.18} y={2188.24}>
              {"H11"}
            </tspan>
          </text>
          <circle
            id="station_node_H12"
            cx={3584.2}
            cy={1974.25}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H12"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3566.8} y={1980.94}>
              {"H12"}
            </tspan>
          </text>
          <circle
            id="station_node_H13"
            cx={3584.2}
            cy={1792.42}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H13"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3567.15} y={1799.11}>
              {"H13"}
            </tspan>
          </text>
          <circle
            id="station_node_H14"
            cx={3473.3}
            cy={1541.23}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H14"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3455.12} y={1547.91}>
              {"H14"}
            </tspan>
          </text>
          <circle
            id="station_node_H15"
            cx={3117.08}
            cy={1478.53}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H15"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3099.58} y={1485.21}>
              {"H15"}
            </tspan>
          </text>
          <circle
            id="station_node_H16"
            cx={3064.57}
            cy={1365.67}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H16"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3046.39} y={1372.36}>
              {"H16"}
            </tspan>
          </text>
          <circle
            id="station_node_H17"
            cx={3064.57}
            cy={969.483}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H17"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3047.03} y={976.17}>
              {"H17"}
            </tspan>
          </text>
          <circle
            id="station_node_H18"
            cx={3064.57}
            cy={721.035}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H18"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3046.65} y={727.722}>
              {"H18"}
            </tspan>
          </text>
          <circle
            id="station_node_H19"
            cx={3064.57}
            cy={543.908}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H19"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3046.36} y={550.595}>
              {"H19"}
            </tspan>
          </text>
          <circle
            id="station_node_H20"
            cx={3152.35}
            cy={448.683}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H20"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3132.8} y={455.37}>
              {"H20"}
            </tspan>
          </text>
          <circle
            id="station_node_H21"
            cx={3256.59}
            cy={347.187}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H21"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3239.19} y={353.874}>
              {"H21"}
            </tspan>
          </text>
          <circle
            id="station_node_H22"
            cx={3555.59}
            cy={300.162}
            r={36.2484}
            fill="#F8F5E6"
            stroke="#B5B5AC"
            strokeWidth={5.87811}
          />
          <text
            id="station_code_H22"
            opacity={0.81}
            fill="black"
            stroke="#B5B5AC"
            strokeWidth={0.391874}
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Merriweather Sans"
            fontSize={18.81}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3536.82} y={306.849}>
              {"H22"}
            </tspan>
          </text>
        </g>
        <g id="transfer">
          <g id="Group 2">
            <rect
              id="TransferBox_M15_H07"
              x={2504.58}
              y={2316.75}
              width={133.237}
              height={90.1311}
              rx={8.22936}
              fill="#5D675F"
              stroke="black"
              strokeWidth={3.91874}
            />
            <rect
              id="station_node_M15"
              x={2576.49}
              y={2325.56}
              width={52.903}
              height={72.4967}
              rx={3.33093}
              fill="#F8F5E6"
              stroke="#B90C0C"
              strokeWidth={5.87811}
            />
            <text
              id="station_code_M15"
              fill="black"
              xmlSpace="preserve"
              style={{
                whiteSpace: "pre",
              }}
              fontFamily="Merriweather Sans"
              fontSize={18.81}
              fontWeight="bold"
              letterSpacing="0em"
            >
              <tspan x={2583.7} y={2368.5}>
                {"M15"}
              </tspan>
            </text>
            <rect
              id="station_node_H07"
              x={2513.01}
              y={2327.13}
              width={52.903}
              height={72.4967}
              rx={3.33093}
              fill="#F8F5E6"
              stroke="#B5B5AC"
              strokeWidth={5.87811}
            />
            <text
              id="station_code_H07"
              opacity={0.81}
              fill="black"
              stroke="#B5B5AC"
              strokeWidth={0.391874}
              xmlSpace="preserve"
              style={{
                whiteSpace: "pre",
              }}
              fontFamily="Merriweather Sans"
              fontSize={18.81}
              fontWeight="bold"
              letterSpacing="0em"
            >
              <tspan x={2519.76} y={2370.07}>
                {"H07"}
              </tspan>
            </text>
          </g>
          <g id="Group 1">
            <rect
              id="TransferBox_M16_H09"
              x={3095.14}
              y={2203.89}
              width={133.237}
              height={90.1311}
              rx={8.22936}
              fill="#5D675F"
              stroke="black"
              strokeWidth={3.91874}
            />
            <rect
              id="station_node_M16"
              x={3166.65}
              y={2212.7}
              width={52.903}
              height={72.4967}
              rx={3.33093}
              fill="#F8F5E6"
              stroke="#B90C0C"
              strokeWidth={5.87811}
            />
            <text
              id="station_code_M16"
              fill="black"
              xmlSpace="preserve"
              style={{
                whiteSpace: "pre",
              }}
              fontFamily="Merriweather Sans"
              fontSize={18.81}
              fontWeight="bold"
              letterSpacing="0em"
            >
              <tspan x={3173.19} y={2256.82}>
                {"M16"}
              </tspan>
            </text>
            <rect
              id="station_node_H09"
              x={3103.95}
              y={2212.7}
              width={52.903}
              height={72.4967}
              rx={3.33093}
              fill="#F8F5E6"
              stroke="#B5B5AC"
              strokeWidth={5.87811}
            />
            <text
              id="station_code_H09"
              opacity={0.81}
              fill="black"
              stroke="#B5B5AC"
              strokeWidth={0.391874}
              xmlSpace="preserve"
              style={{
                whiteSpace: "pre",
              }}
              fontFamily="Merriweather Sans"
              fontSize={18.81}
              fontWeight="bold"
              letterSpacing="0em"
            >
              <tspan x={3110.03} y={2255.64}>
                {"H09"}
              </tspan>
            </text>
          </g>
        </g>
        <g id="station_name">
          <text
            id="station_name_H01"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={827.889} y={2565.57}>
              {"\uB098\uCE74\uBA54\uAD6C\uB85C"}
            </tspan>
          </text>
          <text
            id="station_name_H02"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1087.02} y={2565.57}>
              {"\uC5D0\uBE44\uC2A4"}
            </tspan>
          </text>
          <text
            id="station_name_H03"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1400.91} y={2565.57}>
              {"\uD788\uB85C\uC624"}
            </tspan>
          </text>
          <text
            id="station_name_H04"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1788.87} y={2565.57}>
              {"\uB86F\uD3F0\uAE30"}
            </tspan>
          </text>
          <text
            id="station_name_H05"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2195.19} y={2565.57}>
              {"\uAC00\uBBF8\uC57C\uCD08"}
            </tspan>
          </text>
          <text
            id="station_name_H06"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2401.32} y={2565.57}>
              {"\uD1A0\uB77C\uB178\uBAAC"}
            </tspan>
          </text>
          <text
            id="station_name_H07"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2541.5} y={2435.47}>
              {"\uCE74\uC2A4\uBBF8\uAC00\uC138\uD0A4"}
            </tspan>
          </text>
          <text
            id="station_name_H08"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2870.05} y={2311.24}>
              {"\uD788\uBE44\uC57C"}
            </tspan>
          </text>
          <text
            id="station_name_H09"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3172.63} y={2322.22}>
              {"\uAE34\uC790"}
            </tspan>
          </text>
          <text
            id="station_name_H10"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3418.18} y={2312.81}>
              {"\uD788\uAC00\uC2DC\uAE34\uC790"}
            </tspan>
          </text>
          <text
            id="station_name_H11"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3630.83} y={2188.98}>
              {"\uCE20\uD0A4\uC9C0"}
            </tspan>
          </text>
          <text
            id="station_name_H12"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3630.83} y={1981.68}>
              {"\uD56B\uCD78\uBCF4\uB9AC"}
            </tspan>
          </text>
          <text
            id="station_name_H13"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3630.83} y={1799.85}>
              {"\uCE74\uC57C\uBC14\uCD78"}
            </tspan>
          </text>
          <text
            id="station_name_H14"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3442.58} y={1603.52}>
              {"\uB2CC\uAD50\uCD08"}
            </tspan>
          </text>
          <text
            id="station_name_H15"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3163.71} y={1485.96}>
              {"\uCF54\uB374\uB9C8\uCD78"}
            </tspan>
          </text>
          <text
            id="station_name_H16"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3112.38} y={1373.1}>
              {"\uC544\uD0A4\uD558\uBC14\uB77C"}
            </tspan>
          </text>
          <text
            id="station_name_H17"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3112.38} y={976.913}>
              {"\uB098\uCE74\uC624\uCE74\uCE58\uB9C8\uCE58"}
            </tspan>
          </text>
          <text
            id="station_name_H18"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3112.38} y={728.465}>
              {"\uC6B0\uC5D0\uB178"}
            </tspan>
          </text>
          <text
            id="station_name_H19"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3112.38} y={551.338}>
              {"\uC774\uB9AC\uC57C"}
            </tspan>
          </text>
          <text
            id="station_name_H20"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3199.77} y={456.112}>
              {"\uBBF8\uB178\uC640"}
            </tspan>
          </text>
          <text
            id="station_name_H21"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3302.05} y={354.617}>
              {"\uBBF8\uB098\uBBF8\uC13C\uC96C"}
            </tspan>
          </text>
          <text
            id="station_name_H22"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3514.43} y={362.454}>
              {"\uD0A4\uD0C0\uC13C\uC96C"}
            </tspan>
          </text>
          <text
            id="station_name_M01"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={314.79} y={1132.49}>
              {"\uC624\uAE30\uCFE0\uBCF4"}
            </tspan>
          </text>
          <text
            id="station_name_M02"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={393.165} y={1217.13}>
              {"\uBBF8\uB098\uBBF8\uC544\uC0AC\uAC00\uC57C"}
            </tspan>
          </text>
          <text
            id="station_name_M03"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={471.54} y={1300.21}>
              {"\uC2E0\uCF54\uC5D4\uC9C0"}
            </tspan>
          </text>
          <text
            id="station_name_M04"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={547.563} y={1384.85}>
              {"\uD788\uAC00\uC2DC\uCF54\uC5D4\uC9C0"}
            </tspan>
          </text>
          <text
            id="station_name_M05"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={631.816} y={1463.23}>
              {"\uC2E0\uB098\uCE74\uB178"}
            </tspan>
          </text>
          <text
            id="station_name_M06"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={610.689} y={1616.06}>
              {"\uB098\uCE74\uB178\uC0AC\uCE74\uC6B0\uC5D0"}
            </tspan>
          </text>
          <text
            id="station_name_M07"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={842.193} y={1616.06}>
              {"\uB2C8\uC2DC\uC2E0\uC8FC\uCFE0"}
            </tspan>
          </text>
          <text
            id="station_name_M08"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1073.89} y={1616.06}>
              {"\uC2E0\uC8FC\uCFE0"}
            </tspan>
          </text>
          <text
            id="station_name_M09"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1376.77} y={1607.83}>
              {"\uC2E0\uC8FC\uCFE0\uC0B0\uCD08\uBA54"}
            </tspan>
          </text>
          <text
            id="station_name_M10"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1395.61} y={1741.07}>
              {"\uC2E0\uC8FC\uCFE0\uAD50\uC5D4\uB9C8\uC5D0"}
            </tspan>
          </text>
          <text
            id="station_name_M11"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1567.5} y={1741.07}>
              {"\uC694\uCE20\uC57C\uC0B0\uCD08\uBA54"}
            </tspan>
          </text>
          <text
            id="station_name_M12"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1837.61} y={1686.21}>
              {"\uC694\uCE20\uC57C"}
            </tspan>
          </text>
          <text
            id="station_name_M13"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2188.34} y={2043.99}>
              {"\uC544\uCE74\uC0AC\uCE74\uBBF8\uCE20\uCF00"}
            </tspan>
          </text>
          <text
            id="station_name_M14"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2382.32} y={2235.22}>
              {"\uCF67\uCE74\uC774\uAE30\uC9C0\uB3C4\uB9C8\uC5D0"}
            </tspan>
          </text>
          <text
            id="station_name_M17"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={3080.25} y={1965.22}>
              {"\uB3C4\uCFC4"}
            </tspan>
          </text>
          <text
            id="station_name_M18"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2805.93} y={1782.21}>
              {"\uC624\uD14C\uB9C8\uCE58"}
            </tspan>
          </text>
          <text
            id="station_name_M19"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2805.93} y={1362.52}>
              {"\uC544\uC640\uC9C0\uCD08"}
            </tspan>
          </text>
          <text
            id="station_name_M20"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2805.93} y={1209.29}>
              {"\uC624\uCC28\uB178\uBBF8\uC988"}
            </tspan>
          </text>
          <text
            id="station_name_M21"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2461.42} y={1063.91}>
              {"\uD63C\uACE0\uC0B0\uCD08\uBA54"}
            </tspan>
          </text>
          <text
            id="station_name_M22"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={2164.04} y={1063.91}>
              {"\uCF54\uB77C\uCFE0\uC5D4"}
            </tspan>
          </text>
          <text
            id="station_name_M23"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1834.86} y={853.473}>
              {"\uBB18\uAC00\uB2E4\uB2C8"}
            </tspan>
          </text>
          <text
            id="station_name_M24"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1615.02} y={853.473}>
              {"\uC2E0\uC624\uCE20\uCE74"}
            </tspan>
          </text>
          <text
            id="station_name_M25"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={1312.05} y={853.473}>
              {"\uC774\uCF00\uBD80\uCFE0\uB85C"}
            </tspan>
          </text>
          <text
            id="station_name_Mb03"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={134.962} y={1616.06}>
              {"\uD638\uB09C\uCD08"}
            </tspan>
          </text>
          <text
            id="station_name_Mb04"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={259.961} y={1616.06}>
              {"\uB098\uCE74\uB178\uD6C4\uC9C0\uBBF8\uCD08"}
            </tspan>
          </text>
          <text
            id="station_name_Mb05"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="NanumMyeongjo"
            fontSize={21.5531}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={440.471} y={1616.06}>
              {"\uB098\uCE74\uB178\uC2E0\uBC14\uC2DC"}
            </tspan>
          </text>
        </g>
        <text
          id="station_title_hibiya"
          fill="#9A9A92"
          xmlSpace="preserve"
          style={{
            whiteSpace: "pre",
          }}
          fontFamily="Arial"
          fontSize={25.0799}
          fontWeight="bold"
          letterSpacing="0em"
        >
          <tspan x={832.945} y={2441.04}>
            {"\uD788\uBE44\uC57C\uC120"}
          </tspan>
        </text>
        <text
          id="station_title_hibiya_2"
          fill="#B90C0C"
          xmlSpace="preserve"
          style={{
            whiteSpace: "pre",
          }}
          fontFamily="Arial"
          fontSize={25.0799}
          fontWeight="bold"
          letterSpacing="0em"
        >
          <tspan x={191.3} y={1058.51}>
            {"\uB9C8\uB8E8\uB178\uC6B0\uCE58\uC120"}
          </tspan>
        </text>
      </g>
    </g>
  </svg>


)

}

