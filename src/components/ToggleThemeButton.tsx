import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

function isValidThemeMode(value: unknown): value is ThemeMode {
  return value === 'dark' || value === 'light';
}

export function ToggleThemeButton({ disabled }: { readonly disabled?: boolean }) {
  const getInitialTheme = (): ThemeMode => {
    const stored = localStorage.getItem('themeMode');
    return isValidThemeMode(stored) ? stored : 'dark';
  };

  const applyTheme = (theme: ThemeMode) => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.classList.toggle('dark', theme === 'dark');
    }
  };

  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme());

  const toggleThemeHandler = () => {
    const newThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('themeMode', newThemeMode);
    setThemeMode(newThemeMode);
    applyTheme(newThemeMode);
  };

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  const buttonStyles = [
    'group flex items-center justify-center rounded-full p-2',
    'text-muted transition-all duration-200',
    'hover:bg-[var(--color-light-surface-elevated)] hover-text-accent',
    'dark:hover:bg-[var(--color-graphite)]',
    'active:scale-95',
  ].join(' ');

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={toggleThemeHandler}
      className={buttonStyles}
      title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      {themeMode === 'dark' ? (
        <svg
          className="size-5 transition-transform group-hover:rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg
          className="size-5 transition-transform group-hover:-rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      )}
    </button>
  );
}
