import { useState, useEffect, useRef, useMemo } from 'react';
import { useAnimation, useMotionValue, useDragControls } from 'framer-motion';

export const useBottomSheet = ({ sheetMode, setSheetMode } = {}) => {
  //console.log(sheetMode);
  const controls = useAnimation();
  const dragControls = useDragControls();
  // DOM 측정용 ref
  const headerRef = useRef(null);
  const sheetRef = useRef(null); //전체 컨테이너
  const firstRowRef = useRef(null); // 첫 번째 줄 컨테이너
  //높이 상태 2개
  const [headerHeight, setHeaderHeight] = useState(0); // 측정된 헤더 높이
  const [sheetHeight, setSheetHeight] = useState(0);
  const [firstRowHeight, setFirstRowHeight] = useState(0);
  //const [isDesktop, setIsDesktop] = useState(false);
  const y = useMotionValue(0);

  const SNAP_POINTS = useMemo(() => {
    return {
      EXPENDED: 0,
      // 값이 유효하지 않을 경우를 대비한 기본값(0) 처리
      HALF: sheetHeight ? sheetHeight - (headerHeight + firstRowHeight) : 0,
      COLLAPSED: sheetHeight ? sheetHeight - headerHeight : 0,
    };
  }, [sheetHeight, headerHeight, firstRowHeight]); // 👈 의존성 배열: 이 값들이 바뀔 때만 SNAP_POINTS 갱신

  useEffect(() => {
    // ResizeObserver 콜백 정의
    const resizeObserver = new ResizeObserver((entries) => {
        window.requestAnimationFrame(() => {
        for (let entry of entries) {
          // 크롬 구버전 등 호환성 체크
          let height = 0;
          if (entry.borderBoxSize) {
             // borderBoxSize가 배열인지 확인 후 접근
             const borderBoxSize = Array.isArray(entry.borderBoxSize) 
                ? entry.borderBoxSize[0] 
                : entry.borderBoxSize;
             height = borderBoxSize.blockSize;
          } else {
             height = entry.contentRect.height;
          }

          if (entry.target === sheetRef.current) setSheetHeight(height);
          else if (entry.target === headerRef.current) setHeaderHeight(height);
          else if (entry.target === firstRowRef.current) setFirstRowHeight(height);
        }
      });
      /*for (let entry of entries) {
        const height = entry.borderBoxSize
          ? entry.borderBoxSize[0].blockSize
          : entry.contentRect.height;
        if (entry.target === sheetRef.current) setSheetHeight(height);
        else if (entry.target === headerRef.current) setHeaderHeight(height);
        else if (entry.target === firstRowRef.current)
          setFirstRowHeight(height);
      }*/
    });
    // [수정] 각 Ref가 존재할 때만 observe 수행
    if (sheetRef.current)
      resizeObserver.observe(sheetRef.current, { box: "border-box" });
    if (headerRef.current)
      resizeObserver.observe(headerRef.current, { box: "border-box" });
    if (firstRowRef.current)
      resizeObserver.observe(firstRowRef.current, { box: "border-box" });

    return () => resizeObserver.disconnect();
  }, []); // 빈 배열 유지
  
  // 스냅 포인트 정밀 계산

  useEffect(() => {
    // 높이가 0이거나 측정되지 않았을 때는 실행하지 않음
    if (sheetHeight === 0) return;

    // 바텀시트를 아래(COLLAPSED 위치)로 이동
    controls.start({ y: SNAP_POINTS.COLLAPSED });
  }, [sheetHeight, firstRowHeight, controls, SNAP_POINTS.COLLAPSED]);

  //리사이즈시 반응형 감지
  useEffect(() => {
    // SSR 환경 방어: window가 없으면 실행 중단
    if (typeof window === "undefined") return;
    // 1. 미디어 쿼리 객체 생성
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    // 2. 변경 감지 핸들러
    const handleMediaChange = (e) => {
      //setIsDesktop(e.matches); // true or false
    };
    // 3. 초기값 설정 (마운트 시점)
    //setIsDesktop(mediaQuery.matches);
    // 4. 리스너 등록 (Modern browsers)
    // addEventListener는 'change' 이벤트를 사용합니다.
    mediaQuery.addEventListener("change", handleMediaChange);
    // 5. 클린업
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  /*const SNAP_POINTS = useMemo(()=>){
    EXPENDED: 0,
    // 값이 유효하지 않을 경우를 대비한 기본값(0) 처리
    HALF: sheetHeight ? sheetHeight - (headerHeight + firstRowHeight) : 0,
    COLLAPSED: sheetHeight ? sheetHeight - headerHeight : 0,
  };*/

  useEffect(() => {
    if (!sheetMode || sheetHeight === 0) return;

    if (sheetMode === "EXPANDED") {
      controls.start({ y: SNAP_POINTS.EXPANDED });
    } else if (sheetMode === "HALF") {
      controls.start({ y: SNAP_POINTS.HALF });
    } else if (sheetMode === "COLLAPSED") {
      controls.start({ y: SNAP_POINTS.COLLAPSED });
    }
  }, [sheetMode, sheetHeight, SNAP_POINTS, controls]);

  // 데스크톱 모드 일 경우 바텀 시트 위치 고정
  /*useEffect(() => {
   if (isDesktop) {
     controls.start({ y: 0 });
   } else {
     // 이 부분이 실행되어야 y가 551.7로 이동함
     controls.start({ y: SNAP_POINTS.COLLAPSED });
     console.log(SNAP_POINTS.COLLAPSED);
   }
 }, [isDesktop, controls, SNAP_POINTS.COLLAPSED]);*/

  const handleDragEnd = (event, info) => {
    //if (isDesktop) return; // 데스크톱 모드일 경우 드래그 이벤트 미적용
    const currentY = y.get(); // 현재의 절대 위치 (0 ~ 240)
    const velocity = info.velocity.y;
    const VELOCITY_THRESHOLD = 400; // 빠르게 스와이프 했는지 판단 기준값
    //let targetState = "COLLAPSED";
    let targetY = SNAP_POINTS.COLLAPSED;
    let newMode = "COLLAPSED"; //변경할 모드를 저장할 변수
    //스와이프 속도, 위치에 따른 높이 계산 로직
    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      // 스와이프 속도가 빠를 때 로직
      if (velocity < 0) {
        //위로 빠르게 스와이프 했을 경우
        if (currentY > SNAP_POINTS.HALF) {
          targetY = SNAP_POINTS.HALF; // 닫힘 포인트 근처면 중간 높이로
          newMode = "HALF";
        } else {
          targetY = SNAP_POINTS.EXPENDED; // 중간 포인트 근처면 완전 열림으로
          newMode = "EXPENDED";
        }
      } else {
        if (currentY < SNAP_POINTS.HALF) {
          // 아래로 빠르게 스와이프 했을 경우
          targetY = SNAP_POINTS.HALF; // 완전 열림 근처면 중간으로
          newMode = "HALF";
        } else {
          targetY = SNAP_POINTS.COLLAPSED; // 중간 근처면 닫힘으로
          newMode = "COLLAPSED";
        }
      }
    } else {
      //스와이프 속도가 느릴 때 로직
      //각 스냅 포인트와의 거리 계산
      const distToExpanded = Math.abs(currentY - SNAP_POINTS.EXPENDED);
      const distToHalf = Math.abs(currentY - SNAP_POINTS.HALF);
      const distToCollapsed = Math.abs(currentY - SNAP_POINTS.COLLAPSED);
      //가장 가까운 지점 선택후 열림 정도 지정
      if (distToExpanded < distToHalf && distToExpanded < distToCollapsed) {
        targetY = SNAP_POINTS.EXPENDED;
        newMode = "EXPENDED";
      } else if (distToHalf < distToExpanded && distToHalf < distToCollapsed) {
        targetY = SNAP_POINTS.HALF;
        newMode = "HALF";
      } else {
        targetY = SNAP_POINTS.COLLAPSED;
        newMode = "COLLAPSED";
      }
    }
    if(setSheetMode){
      setSheetMode(newMode); // 드래그로 변경한 상태를 부모에게 전달
    }
    //console.log(targetY);
    // 높이 계산후 애니메이션 실행
    controls.start({
      y: targetY,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 250,
      },
    });
  };

  return {
    sheetRef,
    headerRef,
    firstRowRef,
    sheetHeight,
    controls,
    y, // 계산된 motionValue를 반환, 컴포넌트의 style에 연결해야 정상 동작
    //isDesktop,
    handleDragEnd,
    SNAP_POINTS,
    dragControls,
  };
};