import {
  BrowserAuthError,
  InteractionRequiredAuthError,
  InteractionStatus,
  RedirectRequest,
  SsoSilentRequest,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { UserIcon } from '@heroicons/react/24/outline';
import { loginRequest } from '../infrastructure/auth/authConfig';
import { Button } from './Button';

export const LoginButton = () => {
  const { instance, inProgress } = useMsal();
  const accounts = instance.getAllAccounts();
  const account = accounts ? accounts[0] : null;
  const currentMsalOperationInProgress = inProgress;

  return (
    <Button
      disabled={currentMsalOperationInProgress !== InteractionStatus.None}
      onClick={async () => {
        try {
          console.debug('Attempting ssoSilent: ', account);
          const loginResponse = await instance.ssoSilent({
            ...loginRequest,
            account: account,
            loginHint: account?.username,
          } as SsoSilentRequest);

          loginResponse?.account && instance.setActiveAccount(loginResponse.account);

          console.debug('ssoSilent Response', loginResponse);
        } catch (silentError) {
          if (
            silentError instanceof InteractionRequiredAuthError ||
            silentError instanceof BrowserAuthError
          ) {
            // Fallback to alternate method when silent call fails.
            try {
              // Favouring redirect over popup since popup is blocked by default in most browsers. YMMV.
              console.debug('Fall back to loginRedirect: ', account);
              await instance.loginRedirect({
                ...loginRequest,
                account,
                loginHint: account?.username,
                prompt: account?.username ? 'login' : 'select_account',
              } as RedirectRequest);
            } catch (redirectError) {
              // TODO handle this error
              console.error('loginRedirect error', redirectError);
              throw redirectError;
            }
          } else {
            // TODO handle this error
            console.error('ssoSilent error', silentError);
            throw silentError;
          }
        }
      }}>
      <UserIcon className="mr-2 size-5" /> Log in
    </Button>
  );
};
