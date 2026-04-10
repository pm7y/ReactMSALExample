import { User } from '@microsoft/microsoft-graph-types';
import { useEffect, useState } from 'react';
import { useAccessToken } from '../infrastructure/auth/useAccessToken';
import { graphFetch } from './graphFetch';

export function useGraphUserDetails(): {
  user: User | undefined;
  isLoading: boolean;
  error: string | undefined;
} {
  const accessToken = useAccessToken();
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | undefined>();
  const [resolvedToken, setResolvedToken] = useState<string | null>(null);

  // Derived loading: true while a token is present but the fetch for *this* token
  // hasn't completed. Avoids the react-hooks/set-state-in-effect rule by keeping
  // the transition to "loading" implicit in the accessToken change.
  const isLoading = !!accessToken && resolvedToken !== accessToken;

  useEffect(() => {
    if (!accessToken) return;

    const abortController = new AbortController();
    graphFetch('/me', accessToken, { signal: abortController.signal })
      .then(async (response) => {
        if (response.ok) {
          const userData: unknown = await response.json();
          if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
            setUser(userData as User);
            setError(undefined);
          } else {
            setError('Invalid response format from Graph API');
            setUser(undefined);
          }
        } else {
          const errorText = await response.text().catch(() => '');
          const errorMessage = `Graph API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`;
          console.error(errorMessage);
          setError(errorMessage);
          setUser(undefined);
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('useGraphUserDetails error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user details');
        setUser(undefined);
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setResolvedToken(accessToken);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [accessToken]);

  return { user, isLoading, error };
}
