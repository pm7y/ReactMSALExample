import {
  InteractionRequiredAuthError,
  InteractionStatus,
  RedirectRequest,
  SsoSilentRequest,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../infrastructure/auth/authConfig';
import { useActiveAccount } from '../infrastructure/auth/useActiveAccount';
import { Button } from './Button';

export function LoginButton() {
  const { instance, inProgress } = useMsal();
  const account = useActiveAccount();

  return (
    <Button
      variant="primary"
      disabled={inProgress !== InteractionStatus.None}
      onClick={async () => {
        // Only attempt ssoSilent if there's an existing account to SSO from
        if (account) {
          try {
            const loginResponse = await instance.ssoSilent({
              ...loginRequest,
              account: account,
              loginHint: account.username,
            } as SsoSilentRequest);

            if (loginResponse?.account) {
              instance.setActiveAccount(loginResponse.account);
              return;
            }
          } catch (silentError) {
            if (!(silentError instanceof InteractionRequiredAuthError)) {
              console.error('ssoSilent error', silentError);
            }
            // Fall through to loginRedirect
          }
        }

        // No account or ssoSilent failed - use redirect
        try {
          await instance.loginRedirect({
            ...loginRequest,
            loginHint: account?.username,
            prompt: account?.username ? 'login' : 'select_account',
          } as RedirectRequest);
        } catch (redirectError) {
          console.error('loginRedirect error', redirectError);
          throw redirectError;
        }
      }}>
      <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
        />
      </svg>
      <span>Log in</span>
    </Button>
  );
}
