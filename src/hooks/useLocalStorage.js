import { useState, useEffect, useRef } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? item : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('LocalStorage write error:', error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
