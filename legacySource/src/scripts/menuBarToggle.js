import { useState } from 'react';

/**
 * 메뉴바 토글 인터랙션을 관리하는 커스텀 훅
 * @returns {Object} 토글 관련 state와 핸들러
 */
export function useMenuBarToggle() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return {
    // State
    isMenuOpen,
    
    // Handlers
    toggleMenu,
    openMenu,
    closeMenu,
  };
}