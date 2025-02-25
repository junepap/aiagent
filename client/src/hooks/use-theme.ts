
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const THEME_COOKIE_NAME = 'theme';
const THEME_COOKIE_EXPIRES = 7; // days

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (Cookies.get(THEME_COOKIE_NAME) as 'light' | 'dark') || 'dark'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    Cookies.set(THEME_COOKIE_NAME, theme, { expires: THEME_COOKIE_EXPIRES });
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}
