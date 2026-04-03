import { useState, useCallback } from 'react';
import { themes } from '../themes/index.js';

const useTheme = (initialTheme = 'github') => {
  const [activeThemeKey, setActiveThemeKey] = useState(initialTheme);

  const activeTheme = themes[activeThemeKey] ?? themes.github;

  const setTheme = useCallback((key) => {
    if (themes[key]) {
      setActiveThemeKey(key);
    }
  }, []);

  return {
    activeThemeKey,
    activeTheme,
    setTheme,
    themeKeys: Object.keys(themes),
  };
};

export default useTheme;
