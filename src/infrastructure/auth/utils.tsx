import { InvalidTokenError, jwtDecode } from 'jwt-decode';

const tokenDateToLocaleString = (tokenDate: number) => {
  return new Date(tokenDate * 1000).toLocaleString(Intl.Locale.name, {
    timeZoneName: 'short',
  });
};

export function decodeToken(token?: string | null): Record<string, unknown> | null {
  try {
    if (!token) {
      return null;
    }
    const decodedToken = jwtDecode(token) as Record<string, unknown>;
    const unixTimestampKeys = ['exp', 'iat', 'nbf', 'xms_tcdt'];
    unixTimestampKeys.forEach((key) => {
      if (decodedToken[key]) {
        decodedToken[key] = tokenDateToLocaleString(decodedToken[key] as number);
      }
    });

    return decodedToken;
  } catch (error: unknown) {
    console.error('Error decoding token', error);
    const tokenError = error as InvalidTokenError;
    return { error: tokenError.message };
  }
}
