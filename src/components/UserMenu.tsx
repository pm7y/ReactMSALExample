import { useAccount } from '@azure/msal-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useEffect, useRef } from 'react';
import { useGraphUserPhoto } from '../api/useGraphUserPhoto';
import { LogoutButton } from './LogoutButton';

function isValidBlobUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'blob:';
  } catch {
    return false;
  }
}

export function UserMenu() {
  const account = useAccount();
  const userName = account?.idTokenClaims?.name ?? 'USER';
  const { photoBlobUrl } = useGraphUserPhoto();
  const avatarDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (avatarDiv.current && isValidBlobUrl(photoBlobUrl)) {
      avatarDiv.current.style.background = `url(${photoBlobUrl}) no-repeat center center / cover`;
    }
  }, [photoBlobUrl]);

  const avatarWithPhotoStyles = [
    'aspect-square w-8 rounded-full border-2',
    'border-[var(--color-light-accent)] dark:border-[var(--color-signal)]',
    'transition-shadow',
    'group-hover:shadow-[0_0_12px_var(--color-light-accent)]',
    'dark:group-hover:shadow-[0_0_12px_var(--color-signal-glow)]',
  ].join(' ');

  const avatarPlaceholderStyles = [
    'flex aspect-square w-8 items-center justify-center rounded-full',
    'border-2 border-theme bg-surface-elevated',
    'text-xs font-bold text-secondary',
    'transition-all group-hover:border-[var(--color-light-accent)]',
    'dark:group-hover:border-[var(--color-signal)]',
  ].join(' ');

  const dropdownStyles = [
    'z-50 mt-2 origin-top-right rounded-lg',
    'border border-theme bg-surface p-1',
    'shadow-xl shadow-black/10 dark:shadow-black/20',
    'transition-[opacity,transform,visibility] duration-150 ease-out',
    'data-[closed]:invisible data-[closed]:scale-95 data-[closed]:opacity-0',
  ].join(' ');

  return (
    <Menu>
      <MenuButton className="group hover-text-accent flex cursor-pointer items-center gap-2 text-sm transition-all duration-200">
        {photoBlobUrl ? (
          <div className={avatarWithPhotoStyles} ref={avatarDiv} />
        ) : (
          <div className={avatarPlaceholderStyles}>{userName.charAt(0).toUpperCase()}</div>
        )}
        <span className="text-secondary hidden group-hover:text-[var(--color-light-text)] sm:inline dark:group-hover:text-[var(--color-snow)]">
          {userName}
        </span>
        <svg
          className="text-muted size-4 transition-transform group-hover:text-[var(--color-light-accent)] group-data-[active]:rotate-180 dark:group-hover:text-[var(--color-signal)]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </MenuButton>
      <MenuItems transition anchor="bottom end" className={dropdownStyles}>
        <MenuItem>
          <LogoutButton />
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
