import {
  BrowserAuthError,
  InteractionRequiredAuthError,
  InteractionStatus,
  RedirectRequest,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { loginRequest } from './authConfig';

let pageLoad = true;

export const AccessTokenContext = createContext<string | null>(null);

export const AccessTokenProvider = ({ children }: { children: ReactNode }) => {
  const { instance, inProgress } = useMsal();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const accounts = instance.getAllAccounts();
  const account = accounts ? accounts[0] : null;
  const currentMsalOperationInProgress = inProgress;

  useEffect(() => {
    if (account && currentMsalOperationInProgress === InteractionStatus.None) {
      instance
        // First, we'll attempt to silently acquire the token by checking the cache to see if a non-expired access token exists that we can use or refresh.
        .acquireTokenSilent({
          ...loginRequest,
          account,
          // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/token-lifetimes.md#avoiding-interactive-interruptions-in-the-middle-of-a-users-session
          forceRefresh: pageLoad ? true : undefined,
        })
        .then((response) => {
          pageLoad = false;
          console.debug('acquireTokenSilent response: ', response);
          setAccessToken(response.accessToken);
        })
        .catch(async (silentError) => {
          console.error(
            'acquireTokenSilent silentError inProgress',
            silentError,
            currentMsalOperationInProgress,
          );
          if (
            silentError instanceof InteractionRequiredAuthError ||
            silentError instanceof BrowserAuthError
          ) {
            // Fallback to alternate method when silent call fails.
            try {
              // Favouring redirect over popup since popup is blocked by default in most browsers. YMMV.
              await instance.acquireTokenRedirect({
                ...loginRequest,
                account,
                loginHint: account?.username,
                //prompt: account?.username ? "login" : "select_account",
              } as RedirectRequest);
            } catch (redirectError) {
              // TODO handle this error
              console.error('acquireTokenRedirect error', redirectError);
              throw redirectError;
            }
          } else {
            // TODO handle this error
            console.error('acquireTokenSilent error', silentError);
            throw silentError;
          }
        });
    }
  }, [account, instance, currentMsalOperationInProgress]);

  return <AccessTokenContext.Provider value={accessToken}>{children}</AccessTokenContext.Provider>;
};
