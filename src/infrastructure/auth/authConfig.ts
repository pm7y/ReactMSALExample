import { BrowserCacheLocation, Configuration, LogLevel } from '@azure/msal-browser';

/*
 Config object to be passed to Msal on creation.
 https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID as string, // Set this value in the .env file.
    authority: 'https://login.microsoftonline.com/common/oauth2/v2.0',
    redirectUri: '/', // You must register this URI on Azure Portal/App Registration.
    navigateToLoginRequestUrl: true,
    protocolMode: 'AAD', // "AAD" for Entra
  },
  cache: {
    /*
    Use LocalStorage so that token survives closing of the window/tab.
    https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/caching.md
     */
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
  system: {
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

export const loginRequest = {
  /*
  For demo purpose, we're calling the Microsoft Graph API so we use it's default scope.
  This will be different depending on the API you want to call.
  */
  scopes: ['https://graph.microsoft.com/.default'],
};
