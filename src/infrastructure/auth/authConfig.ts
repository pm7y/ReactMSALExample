import { BrowserCacheLocation, Configuration, LogLevel } from '@azure/msal-browser';

function getRequiredEnvVar(name: string): string {
  const value = import.meta.env[name];
  if (!value || typeof value !== 'string') {
    throw new Error(
      `Missing required environment variable: ${name}. Please set this value in the .env file.`,
    );
  }
  return value;
}

/*
 Config object to be passed to Msal on creation.
 https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: getRequiredEnvVar('VITE_MSAL_CLIENT_ID'),
    authority: 'https://login.microsoftonline.com/common',
    // Must be registered in Azure Portal/App Registration.
    // Note: MSAL Browser v5 introduces a redirect bridge page for popup flows.
    // If upgrading to v5, see: https://learn.microsoft.com/entra/msal/javascript/browser/redirect-bridge
    redirectUri: '/',
  },
  cache: {
    /*
    Use LocalStorage so that token survives closing of the window/tab.
    https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/caching.md
     */
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
  system: {
    protocolMode: 'AAD', // "AAD" for Entra ID
    loggerOptions: {
      logLevel: LogLevel.Warning,
      piiLoggingEnabled: false,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest: Readonly<{ scopes: readonly string[] }> = {
  /*
    Request only the minimum scopes needed for the demo.
    User.Read is sufficient for /me and /me/photos endpoints.
    See: https://learn.microsoft.com/graph/permissions-reference#userread
  */
  scopes: ['User.Read'],
} as const;
