import { ReactNode } from 'react';

export function Button({
  children,
  onClick,
  disabled,
  variant = 'default',
}: {
  readonly children: ReactNode;
  readonly onClick: () => void | Promise<void>;
  readonly disabled?: boolean;
  readonly variant?: 'default' | 'primary' | 'ghost';
}) {
  const baseStyles = [
    'relative flex cursor-pointer items-center justify-center gap-2',
    'px-4 py-2.5 text-sm font-medium',
    'transition-all duration-200',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'active:scale-[0.98]',
  ].join(' ');

  const variants = {
    default: [
      'border border-theme bg-surface-elevated text-secondary',
      'hover-border-accent hover-text-primary',
    ].join(' '),
    primary: [
      'border border-[var(--color-light-accent)] bg-[var(--color-light-accent)] text-white',
      'hover:bg-[var(--color-light-accent-hover)] hover:border-[var(--color-light-accent-hover)]',
      'dark:border-[var(--color-signal)] dark:bg-[var(--color-signal)] dark:text-[var(--color-void)]',
      'dark:hover:bg-[var(--color-signal-dim)] dark:hover:border-[var(--color-signal-dim)]',
    ].join(' '),
    ghost: ['border border-transparent text-secondary', 'hover-text-accent'].join(' '),
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]}`}
      onClick={onClick}>
      {children}
    </button>
  );
}
