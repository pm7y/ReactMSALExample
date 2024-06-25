import { useEffect, useState } from 'react';
import { useAccessToken } from '../infrastructure/auth/useAccessToken';

export function useGraphUserPhoto() {
  const accessToken = useAccessToken();
  const [photoBlobUrl, setPhotoBlobUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const request = new Request('https://graph.microsoft.com/v1.0/me/photos/96x96/$value', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'image/jpg',
      }),
    });

    fetch(request)
      .then(async (response) => {
        if (response.ok && response.status !== 404) {
          const blob = await response.blob();
          const url = window.URL || window.webkitURL;
          const blobUrl = url.createObjectURL(blob);

          setPhotoBlobUrl(blobUrl);
        }
      })
      .catch((error) => console.error(error));
  }, [accessToken]);

  return photoBlobUrl;
}
