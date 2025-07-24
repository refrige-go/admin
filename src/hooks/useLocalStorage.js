import { useState, useEffect } from 'react';

/**
 * 로컬 스토리지를 관리하는 커스텀 훅
 * @param {string} key - 로컬 스토리지 키
 * @param {any} initialValue - 초기값
 * @returns {Array} [value, setValue] 배열
 */
export function useLocalStorage(key, initialValue) {
  // 초기값 설정
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`로컬 스토리지에서 ${key} 읽기 실패:`, error);
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`로컬 스토리지에 ${key} 저장 실패:`, error);
    }
  };

  return [storedValue, setValue];
} 