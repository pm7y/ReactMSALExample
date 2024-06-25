import { useIsAuthenticated } from '@azure/msal-react';
import { User } from '@microsoft/microsoft-graph-types';
import { useEffect, useState } from 'react';
import { useAccessToken } from '../infrastructure/auth/useAccessToken';

export function useGraphUserDetails() {
  const isAuthenticated = useIsAuthenticated();
  const accessToken = useAccessToken();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    const request = new Request('https://graph.microsoft.com/v1.0/me', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken,
      }),
    });

    fetch(request)
      .then(async (response) => {
        const user = (await response.json()) as User;
        setUser(user);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [accessToken, isAuthenticated]);

  return { user, isLoading };
}
