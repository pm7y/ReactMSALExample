import { AuthenticatedTemplate, UnauthenticatedTemplate, useAccount } from '@azure/msal-react';
import { CodeBox } from '../components/CodeBox';
import { useAccessToken } from '../infrastructure/auth/useAccessToken';
import { decodeToken } from '../infrastructure/auth/utils';
import { Page } from './Page';

function Claims() {
  const account = useAccount();
  const accessToken = useAccessToken();

  const decodedIdToken = decodeToken(account?.idToken);
  const decodedAccessToken = decodeToken(accessToken);

  return (
    <Page
      header={<h1>Claims</h1>}
      content={
        <>
          <p>
            Here are the claims present in the Id and Access tokens. They provided here for
            information and debugging purposes.
          </p>
          <UnauthenticatedTemplate>
            <div>✋ You must be logged in to see this content.</div>
          </UnauthenticatedTemplate>
          <AuthenticatedTemplate>
            <>
              <h2>Id Token Claims</h2>
              <p>
                An ID token is used to authenticate a user. It provides information about the user,
                such as their identity and profile information.
              </p>
              {decodedIdToken && (
                <CodeBox
                  code={JSON.stringify(decodedIdToken, null, 2)}
                  copyValue={account?.idToken}
                  copyLabel={'Copy Id Token'}
                />
              )}
              <h2>Access Token Claims</h2>
              <p>
                An access token is used to authorise access to protected resources or APIs. It tells
                the resource server what the client application is allowed to do.
              </p>
              {decodedAccessToken && (
                <CodeBox
                  code={JSON.stringify(decodedAccessToken, null, 2)}
                  copyValue={accessToken}
                  copyLabel={'Copy Access Token'}
                />
              )}
            </>
          </AuthenticatedTemplate>
        </>
      }
    />
  );
}

export default Claims;
