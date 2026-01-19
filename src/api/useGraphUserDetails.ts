import { useIsAuthenticated } from '@azure/msal-react';
import { User } from '@microsoft/microsoft-graph-types';
import { useEffect, useState } from 'react';
import { useAccessToken } from '../infrastructure/auth/useAccessToken';
import { graphFetch } from './graphFetch';

export function useGraphUserDetails(): {
  user: User | undefined;
  isLoading: boolean;
  error: string | undefined;
} {
  const isAuthenticated = useIsAuthenticated();
  const accessToken = useAccessToken();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

    setIsLoading(true);
    setError(undefined);
    graphFetch('/me', accessToken, { signal: abortController.signal })
      .then(async (response) => {
        if (response.ok) {
          const userData: unknown = await response.json();
          // Validate response is an object (Graph API should return user object)
          if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
            setUser(userData as User);
          } else {
            setError('Invalid response format from Graph API');
          }
        } else {
          // Include more context in error message
          const errorText = await response.text().catch(() => '');
          const errorMessage = `Graph API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`;
          console.error(errorMessage);
          setError(errorMessage);
        }
      })
      .catch((err) => {
        // Ignore abort errors - these are expected on unmount
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('useGraphUserDetails error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user details');
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [accessToken, isAuthenticated]);

  return { user, isLoading, error };
}
