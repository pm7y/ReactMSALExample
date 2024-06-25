import React from 'react';

export function Button({
  children,
  onClick,
  disabled,
}: {
  readonly children: React.ReactNode;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="duration-250 flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-stone-100 px-4 py-2.5 text-base font-medium leading-none text-black transition-colors hover:border-gray-300 dark:bg-stone-800 dark:text-white dark:hover:border-gray-600"
      onClick={onClick}>
      {children}
    </button>
  );
}
