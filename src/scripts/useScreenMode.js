import { useMediaQuery } from "react-responsive";

export const useScreenMode = () => {
  // 데스크톱 기준: 1024px 이상
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // 모바일 기준: 1023px 이하 (필요하다면 명시적으로 사용, 보통 else로 처리가능)
  const isMobile = useMediaQuery({ maxWidth: 1023 });

  return { isDesktop, isMobile };
};
