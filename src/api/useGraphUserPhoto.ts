import { useEffect, useState } from 'react';
import { useAccessToken } from '../infrastructure/auth/useAccessToken';
import { graphFetch } from './graphFetch';

export function useGraphUserPhoto(): {
  photoBlobUrl: string | undefined;
  error: string | undefined;
} {
  const accessToken = useAccessToken();
  const [photoBlobUrl, setPhotoBlobUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!accessToken) return;

    const abortController = new AbortController();
    let createdBlobUrl: string | undefined;
    graphFetch('/me/photos/96x96/$value', accessToken, {
      signal: abortController.signal,
    })
      .then(async (response) => {
        if (response.ok) {
          const blob = await response.blob();
          createdBlobUrl = URL.createObjectURL(blob);
          setPhotoBlobUrl(createdBlobUrl);
        } else {
          setError(`Failed to load photo: ${response.status} ${response.statusText}`);
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('useGraphUserPhoto error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load photo');
      });

    return () => {
      abortController.abort();
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [accessToken]);

  return { photoBlobUrl, error };
}
