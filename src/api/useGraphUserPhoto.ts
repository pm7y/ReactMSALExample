import { useEffect, useRef, useState } from 'react';
import { useAccessToken } from '../infrastructure/auth/useAccessToken';
import { graphFetch } from './graphFetch';

export function useGraphUserPhoto(): {
  photoBlobUrl: string | undefined;
  isLoading: boolean;
  error: string | undefined;
} {
  const accessToken = useAccessToken();
  const [photoBlobUrl, setPhotoBlobUrl] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const blobUrlRef = useRef<string | undefined>();

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

    setError(undefined);
    graphFetch('/me/photos/96x96/$value', accessToken, {
      contentType: 'image/jpg',
      signal: abortController.signal,
    })
      .then(async (response) => {
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          blobUrlRef.current = blobUrl;
          setPhotoBlobUrl(blobUrl);
        } else {
          // Handle non-OK responses (401, 403, 404, 500, etc.)
          setError(`Failed to load photo: ${response.status} ${response.statusText}`);
        }
      })
      .catch((err) => {
        // Ignore abort errors - these are expected on unmount
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('useGraphUserPhoto error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load photo');
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      abortController.abort();
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, [accessToken]);

  return { photoBlobUrl, isLoading, error };
}
