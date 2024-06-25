import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';

type ThemeMode = 'dark' | 'light';

export function ToggleThemeButton({ disabled }: { readonly disabled?: boolean }) {
  const getInitialTheme = () => (localStorage.getItem('themeMode') ?? 'dark') as ThemeMode;

  const applyTheme = (theme: ThemeMode) => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.classList.toggle('dark', theme === 'dark');
    }
  };

  const [themeMode, setThemeMode] = React.useState<ThemeMode>(getInitialTheme());

  const toggleThemeHandler = () => {
    const newThemeMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('themeMode', newThemeMode);
    setThemeMode(newThemeMode);
    applyTheme(newThemeMode);
  };

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => toggleThemeHandler()}
      className="hover:scale-102 active:scale-98 flex items-center gap-2">
      {themeMode === 'dark' ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  );
}
