import { useState, useCallback } from 'react';
import themes from '../themes/index';
import { DefaultTheme } from 'styled-components';

export type ThemeKey = keyof typeof themes;

const useTheme = (initialTheme: ThemeKey = 'github') => {
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>(initialTheme);

  const activeTheme: DefaultTheme = themes[activeThemeKey] ?? themes.github;

  const setTheme = useCallback((key: string) => {
    if (key in themes) {
      setActiveThemeKey(key as ThemeKey);
    }
  }, []);

  return {
    activeThemeKey,
    activeTheme,
    setTheme,
    themeKeys: Object.keys(themes) as ThemeKey[],
  };
};

export default useTheme;
