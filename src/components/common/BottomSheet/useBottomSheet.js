import { useState, useEffect, useRef } from 'react';
import { useAnimation, useMotionValue } from 'framer-motion';

export const useBottomSheet = () => {
  const controls = useAnimation();
  // DOM 측정용 ref
  const headerRef = useRef(null);
  const sheetRef = useRef(null); //전체 컨테이너
  const firstRowRef = useRef(null); // 첫 번째 줄 컨테이너
  //높이 상태 2개
  const [headerHeight, setHeaderHeight] = useState(0); // 측정된 헤더 높이
  const [sheetHeight, setSheetHeight] = useState(0);
  const [firstRowHeight, setFirstRowHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const y = useMotionValue(0);

  // 전체 높이, 첫 번째 줄 높이 실시간 감지
  /*useEffect(() => {
    if (!sheetRef.current || !firstRowRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === sheetRef.current) {
          setSheetHeight(entry.contentRect.height); // 전체 컨테이너 높이 설정
        } else if (entry.target === firstRowRef.current) {
          setFirstRowHeight(entry.contentRect.height); // 첫 번째 줄 컨테이너 높이 설정
        }
      }
    });
    resizeObserver.observe(sheetRef.current);
    resizeObserver.observe(firstRowRef.current);
  }, []);*/

  // useBottomSheet.js 수정

useEffect(() => {
  // ref들이 연결되지 않았을 때 방어
  if (!sheetRef.current || !firstRowRef.current || !headerRef.current) return;

  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const height = entry.borderBoxSize
        ? entry.borderBoxSize[0].blockSize
        : entry.contentRect.height;

      if (entry.target === sheetRef.current) setSheetHeight(height);
      else if (entry.target === headerRef.current)
        setHeaderHeight(height); // 헤더 업데이트
      else if (entry.target === firstRowRef.current) setFirstRowHeight(height);
    }
  });

  resizeObserver.observe(sheetRef.current, { box: "border-box" });
  resizeObserver.observe(headerRef.current, { box: "border-box" }); // 관찰 시작
  resizeObserver.observe(firstRowRef.current, { box: "border-box" });

  return () => resizeObserver.disconnect();
}, []);

  // 스냅 포인트 정밀 계산
  const SNAP_POINTS = {
    EXPENDED: 0, // 전체 다 보임
    HALF: sheetHeight - (headerHeight + firstRowHeight), // 전체 높이에서 헤더+첫 줄 높이를 뺀 만큼 내려감
    COLLAPSED: sheetHeight - headerHeight, // 헤더만 남기고 다 내려감
  };

  // 높이 변경시 현재 상태유지 로직
  useEffect(() => {
    if (isDesktop || sheetHeight === 0) return; //데스크톱일경우
    // 현재 Y값이 어느 스냅 포인트에 가까운지 판단해서
    // 내용물이 바뀌어도 그 "단계"를 유지하게 해주는 것이 UX상 좋음.
    // 여기서는 단순화를 위해 기본적으로 COLLAPSED로 보정하거나,
    // 혹은 현재 y.get()을 기준으로 가장 가까운 snap point로 재이동시키는 로직 추가 가능.

    // 예시: 높이가 바뀌면 일단 닫힘 상태 기준 재설정 (필요 시 수정 가능)
    // controls.start({ y: SNAP_POINTS.COLLAPSED });
  }, [sheetHeight, firstRowHeight, isDesktop]);

  //리사이즈시 반응형 감지
  useEffect(() => {
    // SSR 환경 방어: window가 없으면 실행 중단
    if (typeof window === "undefined") return;
    // 1. 미디어 쿼리 객체 생성
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    // 2. 변경 감지 핸들러
    const handleMediaChange = (e) => {
      setIsDesktop(e.matches); // true or false
    };
    // 3. 초기값 설정 (마운트 시점)
    setIsDesktop(mediaQuery.matches);
    // 4. 리스너 등록 (Modern browsers)
    // addEventListener는 'change' 이벤트를 사용합니다.
    mediaQuery.addEventListener("change", handleMediaChange);
    // 5. 클린업
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // 데스크톱 모드 일 경우 바텀 시트 위치 고정
  useEffect(() => {
    if (isDesktop) {
      controls.start({ y: 0 });
    } else {
      controls.start({ y: SNAP_POINTS.COLLAPSED }); // 아닐 경우 메인 컨텐츠 높이 만큼만.
    }
  }, [isDesktop, controls, SNAP_POINTS.COLLAPSED]);

  const handleDragEnd = (event, info) => {
    if (isDesktop) return; // 데스크톱 모드일 경우 드래그 이벤트 미적용
    const currentY = y.get(); // 현재의 절대 위치 (0 ~ 240)
    const velocity = info.velocity.y;
    const VELOCITY_THRESHOLD = 400; // 빠르게 스와이프 했는지 판단 기준값
    //let targetState = "COLLAPSED";
    let targetY = SNAP_POINTS.COLLAPSED;

    //스와이프 속도, 위치에 따른 높이 계산 로직
    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      // 스와이프 속도가 빠를 때 로직
      if (velocity < 0) {
        //위로 빠르게 스와이프 했을 경우
        if (currentY > SNAP_POINTS.HALF) {
          targetY = SNAP_POINTS.HALF; // 닫힘 포인트 근처면 중간 높이로
        } else {
          targetY = SNAP_POINTS.EXPENDED; // 중간 포인트 근처면 완전 열림으로
        }
      } else {
        if (currentY < SNAP_POINTS.HALF) {
          // 아래로 빠르게 스와이프 했을 경우
          targetY = SNAP_POINTS.HALF; // 완전 열림 근처면 중간으로
        } else {
          targetY = SNAP_POINTS.COLLAPSED; // 중간 근처면 닫힘으로
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
      } else if (distToHalf < distToExpanded && distToHalf < distToCollapsed) {
        targetY = SNAP_POINTS.HALF;
      } else {
        targetY = SNAP_POINTS.COLLAPSED;
      }
    }

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
    isDesktop,
    handleDragEnd,
    SNAP_POINTS,
  };
};