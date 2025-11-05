import { useState } from 'react';

/**
 * 관리자 모드 전환을 관리하는 커스텀 훅
 * @returns {Object} 관리자 모드 관련 state와 핸들러
 */
export function useAdminModeToggle() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const enterAdminMode = () => {
    setIsAdminMode(true);
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
  };

  return {
    // State
    isAdminMode,
    
    // Handlers
    enterAdminMode,
    exitAdminMode,
  };
}