import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { ArrowsRightLeftIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { GitHubIcon } from '../components/Icons';
import { LoginButton } from '../components/LoginButton';
import { Spinner } from '../components/Spinner';
import { ToggleThemeButton } from '../components/ToggleThemeButton';
import { UserMenu } from '../components/UserMenu';

/** Type-safe route paths matching defined routes */
type RoutePath = '/' | '/claims' | '/msgraph';

const NavLink = ({
  to,
  children,
  label,
}: {
  to: RoutePath;
  children: React.ReactNode;
  label: string;
}) => {
  const router = useRouterState();
  const isActive = router.location.pathname === to;

  const baseStyles =
    'group relative flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200';
  const activeStyles = 'text-accent';
  const inactiveStyles = 'text-muted hover-text-primary';

  return (
    <Link to={to} className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <span className="hidden sm:inline">{label}</span>
      </span>
      {isActive && (
        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--color-signal)]" />
      )}
    </Link>
  );
};

export function Shell() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  const headerStyles = [
    'sticky top-0 z-50 border-b border-theme',
    'bg-[var(--color-light-bg)]/95 dark:bg-[var(--color-void)]/95',
    'backdrop-blur-sm',
  ].join(' ');

  return (
    <div className="flex min-h-screen flex-col">
      <header className={headerStyles}>
        <nav className="flex w-full items-center justify-between py-3">
          <div className="flex items-center gap-1">
            <NavLink to="/" label="Welcome">
              <HomeIcon className="size-5" />
            </NavLink>

            <span className="divider-vertical mx-2" />

            <NavLink to="/claims" label="Claims">
              <UserIcon className="size-5" />
            </NavLink>

            <NavLink to="/msgraph" label="MS Graph">
              <ArrowsRightLeftIcon className="size-5" />
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            <ToggleThemeButton />
            {inProgress === InteractionStatus.None &&
              (isAuthenticated ? <UserMenu /> : <LoginButton />)}
          </div>
        </nav>
      </header>

      <main className="flex-1 py-8">
        <Outlet />
      </main>

      {inProgress !== InteractionStatus.None && <Spinner />}

      <footer className="border-theme border-t py-6">
        <div className="text-muted flex items-center justify-center gap-2 text-xs">
          <span>Source on</span>
          <a
            target="_blank"
            rel="noopener"
            href="https://github.com/pm7y/React-MSAL-Example"
            className="text-secondary hover-text-accent inline-flex items-center gap-1 transition-colors">
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
