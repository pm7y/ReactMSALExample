import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { useGraphUserDetails } from '../api/useGraphUserDetails';
import { CodeBox } from '../components/CodeBox';
import { Spinner } from '../components/Spinner';
import { Page } from './Page';

function MsGraph() {
  const { user, isLoading } = useGraphUserDetails();

  return (
    <Page
      header={<h1>Call MS Graph</h1>}
      content={
        <>
          <p>
            Once you have an access token you can use that token to call an API. This is a simple
            example of calling the{' '}
            <a
              href="https://developer.microsoft.com/en-us/graph/graph-explorer"
              rel="noopener"
              target="_blank">
              Microsoft Graph API
            </a>{' '}
            to retrieve some profile data about the user including their photo if there is one.
          </p>
          <UnauthenticatedTemplate>
            <div>✋ You must be logged in to see this content.</div>
          </UnauthenticatedTemplate>
          <AuthenticatedTemplate>
            <p>
              Note:{' '}
              <i>
                The amount of fields populated below will depend on what has been populated in Entra
                Id
              </i>
              .
            </p>
            {isLoading ? (
              <Spinner />
            ) : user ? (
              <>
                <CodeBox code={JSON.stringify(user, null, 2)} />
              </>
            ) : (
              <div>User details could not be retrieved 🫤</div>
            )}
          </AuthenticatedTemplate>
        </>
      }
    />
  );
}

export default MsGraph;
