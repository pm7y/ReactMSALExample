import { createStandardPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import '@fontsource-variable/open-sans';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CustomNavigationClient } from './CustomNavigationClient.tsx';
import './index.css';
import { AccessTokenProvider } from './infrastructure/auth/AccessTokenProvider.tsx';
import { msalConfig } from './infrastructure/auth/authConfig.ts';
import { getRoutes } from './routes.tsx';

/*
  createStandardPublicClientApplication returns an already initialized instance of PublicClientApplication.
  https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md
*/
await createStandardPublicClientApplication(msalConfig)
  .then((pca) => {
    const router = createRouter({
      routeTree: getRoutes(),
    });

    /*
      The CustomNavigationClient is a custom implementation of INavigationClient that uses our router to navigate within the app.
      This is necessary because the default navigation client provided by @azure/msal-browser
      uses window.location to navigate the app, which is not compatible with a single page application.
    */
    const navigationClient = new CustomNavigationClient(router);
    // Must set the navigation client before calling handleRedirectPromise
    pca.setNavigationClient(navigationClient);

    pca.handleRedirectPromise().then((authResult) => {
      if (authResult?.account) {
        pca.setActiveAccount(authResult.account);
      }
    });

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <MsalProvider instance={pca}>
          <AccessTokenProvider>
            <RouterProvider router={router} />
          </AccessTokenProvider>
        </MsalProvider>
      </React.StrictMode>,
    );
  })
  .catch((unknownError: unknown) => {
    console.error('Error intialising application', unknownError);
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <>
        <h1>Oops, Something went wrong 😭</h1>
        <p>The app could not be initialised.</p>
      </>,
    );
  });
