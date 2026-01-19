import { AuthenticatedTemplate, UnauthenticatedTemplate, useAccount } from '@azure/msal-react';
import {
  BookOpenIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline';
import { ReactNode } from 'react';
import { GitHubIcon } from '../components/Icons';
import { Page } from './Page';

// Reusable card component for feature sections
const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) => {
  const cardStyles = [
    'group rounded-lg border border-theme bg-surface-elevated p-6',
    'transition-all hover-border-accent',
  ].join(' ');

  return (
    <div className={cardStyles}>
      <div className="mb-4 flex items-center gap-3">
        <div className="icon-container-accent">
          <span className="text-accent">{icon}</span>
        </div>
        <h2 className="text-primary !my-0">{title}</h2>
      </div>
      {children}
    </div>
  );
};

// Reusable list item with arrow indicator
const ArrowListItem = ({ title, description }: { title: string; description: string }) => (
  <li className="flex gap-2">
    <span className="text-accent mt-1">→</span>
    <span>
      <strong>{title}:</strong> {description}
    </span>
  </li>
);

// Reusable external link button
const LinkButton = ({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) => {
  const linkStyles = [
    'inline-flex items-center gap-2 rounded-lg',
    'border border-theme bg-surface-elevated',
    'px-4 py-2 text-sm text-secondary',
    'transition-all hover-border-accent hover-text-accent',
  ].join(' ');

  return (
    <a target="_blank" rel="noopener" href={href} className={linkStyles}>
      {icon}
      {children}
    </a>
  );
};

function getFirstName(name: string | undefined): string | undefined {
  if (!name) return undefined;
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  return trimmed.split(' ')[0] || undefined;
}

export function Welcome() {
  const account = useAccount();
  const userFirstName = getFirstName(account?.idTokenClaims?.name);

  return (
    <Page
      header={
        <>
          <UnauthenticatedTemplate>
            <h1>
              Welcome
              <span className="ml-3 inline-block origin-[70%_70%] animate-[wave_2s_ease-in-out_infinite]">
                {'\u{1F44B}'}
              </span>
            </h1>
          </UnauthenticatedTemplate>
          <AuthenticatedTemplate>
            <h1>
              Hey, <span className="text-accent">{userFirstName}</span>
            </h1>
          </AuthenticatedTemplate>
        </>
      }
      content={
        <>
          <p className="text-secondary">
            This demo shows how to integrate a React/TypeScript application with the{' '}
            <span className="text-primary">Microsoft Authentication Library (MSAL)</span> to
            authenticate users via Microsoft Entra ID.
          </p>

          <p className="text-muted">
            When working with Microsoft Entra ID, there are two main strategies: delegate
            authentication to the frontend using MSAL, or delegate to your backend API. This demo
            focuses on the frontend approach.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <FeatureCard icon={<CodeBracketIcon className="size-5" />} title="SPA Authentication">
              <ul className="space-y-3 text-sm">
                <ArrowListItem
                  title="Seamless UX"
                  description="Fewer redirects, background token refresh"
                />
                <ArrowListItem
                  title="Stateless Backend"
                  description="No server-side session management"
                />
                <ArrowListItem
                  title="Direct Tokens"
                  description="Frontend handles auth flows directly"
                />
              </ul>
            </FeatureCard>

            <FeatureCard icon={<ServerStackIcon className="size-5" />} title="API Authentication">
              <ul className="space-y-3 text-sm">
                <ArrowListItem
                  title="Centralized Control"
                  description="Security logic on the server"
                />
                <ArrowListItem
                  title="Simple Frontend"
                  description="Auth complexity offloaded to backend"
                />
                <ArrowListItem title="Token Security" description="Tokens managed server-side" />
              </ul>
            </FeatureCard>
          </div>

          <div className="border-theme mt-10 border-t pt-8">
            <h2>Explore</h2>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="https://github.com/pm7y/React-MSAL-Example" icon={<GitHubIcon />}>
                View source
              </LinkButton>
              <LinkButton
                href="https://learn.microsoft.com/en-us/entra/identity-platform/msal-overview"
                icon={<BookOpenIcon className="size-4" />}>
                MSAL docs
              </LinkButton>
              <LinkButton
                href="https://aka.ms/aadcodesamples"
                icon={<CodeBracketSquareIcon className="size-4" />}>
                Code samples
              </LinkButton>
            </div>
          </div>
        </>
      }
    />
  );
}
