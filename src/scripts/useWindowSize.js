import { useState, useEffect } from "react";

export default function useWindowSize() {
  // 1. 초기 상태 설정 시 즉시 실행 함수를 사용하여 안전성 보장
  const [windowSize, setWindowSize] = useState(() => {
    // window 객체가 없는 경우 (SSR 환경)에는 안전한 기본값(0) 반환
    if (typeof window === "undefined") {
      return { width: 0, height: 0 };
    }
    // window 객체가 있는 경우 (클라이언트 환경)에는 실제 값 반환
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    // 클라이언트 환경에서만 리스너 등록
    if (typeof window === "undefined") {
      return;
    }

    // ... (이후 리사이즈 이벤트 처리 로직은 동일) ...

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // 마운트 시 한번 실행하여 정확한 초기값 보장

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize; // 항상 객체를 반환하도록 보장
}
