import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionRequiredAuthError,
  InteractionStatus,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { ReactNode, createContext, useEffect, useRef, useState } from 'react';
import { loginRequest } from './authConfig';
import { useActiveAccount } from './useActiveAccount';

/**
 * Access token context value:
 * - undefined: Hook used outside provider (error case)
 * - null: Inside provider but no token available yet
 * - string: Valid access token
 */
export type AccessTokenContextValue = string | null | undefined;

export const AccessTokenContext = createContext<AccessTokenContextValue>(undefined);

/**
 * Stores the access token in React context for convenient consumption via useAccessToken().
 *
 * Note: Microsoft recommends calling acquireTokenSilent before each API call rather than
 * storing tokens. This context-based approach trades strict freshness for simplicity.
 * The refreshTokenExpirationOffsetSeconds (300s) ensures the cached token has at least
 * 5 minutes of validity, and the event subscription catches background refreshes.
 * For production apps with frequent API calls, consider calling acquireTokenSilent directly.
 * See: https://learn.microsoft.com/entra/identity-platform/scenario-spa-acquire-token
 */
export function AccessTokenProvider({ children }: { children: ReactNode }) {
  const { instance, inProgress } = useMsal();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const isAcquiringRef = useRef(false);
  const account = useActiveAccount();

  // Subscribe to MSAL events to catch tokens acquired outside the explicit acquireTokenSilent
  // call below (e.g., login success from redirect, or token refresh triggered by other components).
  // On initial load, both this subscription and the acquireTokenSilent .then() may set the same
  // token -- this is intentional redundancy for robustness.
  useEffect(() => {
    const callbackId = instance.addEventCallback((event: EventMessage) => {
      if (
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.LOGIN_SUCCESS
      ) {
        const result = event.payload as AuthenticationResult;
        if (result?.accessToken) {
          setAccessToken(result.accessToken);
        }
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  useEffect(() => {
    let isMounted = true;

    if (account && inProgress === InteractionStatus.None && !isAcquiringRef.current) {
      isAcquiringRef.current = true;
      instance
        // First, we'll attempt to silently acquire the token by checking the cache to see if a non-expired access token exists that we can use or refresh.
        .acquireTokenSilent({
          scopes: [...loginRequest.scopes],
          account,
          // Ensure token is valid for at least 5 minutes (300 seconds) to avoid mid-session interruptions
          // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/token-lifetimes.md#avoiding-interactive-interruptions-in-the-middle-of-a-users-session
          refreshTokenExpirationOffsetSeconds: 300,
        })
        .then((response) => {
          if (isMounted) {
            setAccessToken(response.accessToken);
          }
        })
        .catch(async (silentError) => {
          console.error('acquireTokenSilent silentError inProgress', silentError, inProgress);
          if (silentError instanceof InteractionRequiredAuthError) {
            // Fallback to alternate method when silent call fails.
            try {
              // Favouring redirect over popup since popup is blocked by default in most browsers. YMMV.
              await instance.acquireTokenRedirect({
                scopes: [...loginRequest.scopes],
                account,
                loginHint: account?.username,
              });
            } catch (redirectError) {
              // Note: Error handling simplified for demo - production apps should show UI feedback
              console.error('acquireTokenRedirect error', redirectError);
              // Error is logged; redirect will navigate away from page
            }
          } else {
            // Note: Error handling simplified for demo - production apps should show UI feedback
            console.error('acquireTokenSilent error', silentError);
            // Error is logged; token acquisition failed but app continues
          }
        })
        .finally(() => {
          if (isMounted) {
            isAcquiringRef.current = false;
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [account, instance, inProgress]);

  return <AccessTokenContext.Provider value={accessToken}>{children}</AccessTokenContext.Provider>;
}
