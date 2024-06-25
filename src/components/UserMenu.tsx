import { useAccount } from '@azure/msal-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

import { UserCircleIcon } from '@heroicons/react/24/outline';
import React, { createRef, useEffect } from 'react';
import { useGraphUserPhoto } from '../api/useGraphUserPhoto';
import { LogoutButton } from './LogoutButton';

export const UserMenu = () => {
  const account = useAccount();
  const userName = account?.idTokenClaims?.name ?? 'USER';
  const photoBlobUrl = useGraphUserPhoto();
  const avatarDiv = createRef<HTMLDivElement>();

  useEffect(() => {
    if (avatarDiv.current) {
      avatarDiv.current.style.background = `url(${photoBlobUrl}) no-repeat center center / cover`;
    }
  }, [avatarDiv, photoBlobUrl]);

  const LogoutMenuItem = React.forwardRef(() => <LogoutButton />);

  return (
    <Menu>
      <MenuButton className="inline-flex cursor-pointer items-center justify-center gap-1 text-base font-medium leading-none">
        {photoBlobUrl ? (
          <>
            <div
              className="mr-2 aspect-square w-8 rounded-full border border-orange-300"
              ref={avatarDiv}
            />
            <span className="hidden sm:inline">{userName}</span>
          </>
        ) : (
          <>
            <UserCircleIcon className="mr-2 size-8" />
            <span className="hidden sm:inline">{userName}</span>
          </>
        )}
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="mt-2 origin-top-right rounded-md border border-neutral-100 bg-neutral-100 text-sm drop-shadow-md">
        <MenuItem>
          <LogoutMenuItem />
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
