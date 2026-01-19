import { jwtDecode } from 'jwt-decode';

const tokenDateToLocaleString = (tokenDate: number) => {
  return new Date(tokenDate * 1000).toLocaleString(undefined, {
    timeZoneName: 'short',
  });
};

export function decodeToken(token?: string | null): Record<string, unknown> | null {
  try {
    if (!token) {
      return null;
    }
    // JWTs must have 3 dot-separated parts: header.payload.signature
    // Microsoft Graph access tokens are often opaque (non-JWT) - this is expected
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const decodedToken = jwtDecode<Record<string, unknown>>(token);
    const unixTimestampKeys = ['exp', 'iat', 'nbf', 'xms_tcdt'];
    unixTimestampKeys.forEach((key) => {
      const value = decodedToken[key];
      if (typeof value === 'number') {
        decodedToken[key] = tokenDateToLocaleString(value);
      }
    });

    return decodedToken;
  } catch (error) {
    // jwtDecode throws InvalidTokenError for malformed tokens
    // Log unexpected errors for debugging while still gracefully returning null
    if (error instanceof Error && error.name !== 'InvalidTokenError') {
      console.error('Unexpected error decoding token:', error);
    }
    return null;
  }
}
