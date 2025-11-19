import { useLayoutEffect } from "react";

export const useBodyScrollLock = (isLocked = true) => {
  useLayoutEffect(() => {
    if (!isLocked) return;

    // 1. 현재 스크롤바의 너비 계산 (레이아웃 쉬프트 방지)
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // 2. 기존 스타일 저장
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(
      document.body
    ).paddingRight;

    // 3. 스크롤 잠금 적용
    document.body.style.overflow = "hidden";

    // 스크롤바 너비만큼 패딩을 줘서 내용이 밀리는 것 방지 (PC에서 중요)
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${
        parseInt(originalPaddingRight || "0") + scrollBarWidth
      }px`;
    }

    // 4. 클린업: 컴포넌트가 사라지거나 isLocked가 false가 되면 복원
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
};
