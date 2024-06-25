import { AuthenticatedTemplate, UnauthenticatedTemplate, useAccount } from '@azure/msal-react';
import { CodeBracketIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Page } from './Page';

function Welcome() {
  const account = useAccount();
  const userFirstName = account?.idTokenClaims?.name?.split(' ')[0];

  return (
    <Page
      header={
        <>
          <UnauthenticatedTemplate>
            <h1>
              Welcome <span className="ml-2 drop-shadow-md">👋</span>
            </h1>
          </UnauthenticatedTemplate>
          <AuthenticatedTemplate>
            <h1>
              Hey, {userFirstName}
              <span className="ml-2 drop-shadow-md">👋</span>
            </h1>
          </AuthenticatedTemplate>
        </>
      }
      content={
        <>
          <p>
            Welcome to this demo site, where you'll see how to integrate a React/TypeScript
            application with the Microsoft Authentication Library (MSAL) to authenticate users via
            Microsoft Entra ID. In modern web development, Single Page Applications (SPAs) often
            need a robust and seamless authentication mechanism. When working with Microsoft Entra
            ID, there are two main strategies to consider.
          </p>
          <p>
            One approach is to delegate the authentication to the frontend using MSAL. Another way
            would be to delegate the responsibility to your backend API (e.g. ASP.NET). There are
            pros and cons to each approach and which one you choose will depend on your specific
            requirements.
          </p>
          <p>
            This demo site is solely focused on exploring the first approach i.e. how to
            authenticate via the frontend using MSAL. Here are a few of the things you might
            consider when choosing one way or the other.
          </p>
          <div className="mt-8 text-sm sm:flex sm:justify-between sm:gap-8">
            <div className="rounded-xl bg-stone-200 px-4 pb-8 pt-1 sm:w-1/2 dark:bg-zinc-800">
              <div className="flex justify-center gap-4 align-middle">
                <CodeBracketIcon className="w-12" />
                <h2>SPA authentication (MSAL)</h2>
              </div>
              <ul className="list-disc pl-8">
                <li className="pb-4">
                  <b>Seamless User Experience:</b> You need a smooth user experience with fewer
                  redirects, making the authentication process feel more integrated and less
                  disruptive. Once the user is authenticated, most of the token handling (including
                  refreshing tokens) happens in the background.
                </li>
                <li className="pb-4">
                  <b>Simplified Backend:</b> Your application benefits from a stateless backend,
                  reducing the complexity of server-side session management.
                </li>
                <li className="pb-4">
                  <b>Direct Token Management:</b> You prefer the frontend to directly handle tokens,
                  managing authentication flows and token refresh within the SPA.
                </li>
              </ul>
            </div>
            <div className="mt-8 rounded-xl bg-stone-200 px-4 pb-8 pt-1 sm:mt-0 sm:w-1/2 dark:bg-zinc-800">
              <div className="flex justify-center gap-4 align-middle">
                <Cog6ToothIcon className="w-12" />
                <h2>API authentication</h2>
              </div>
              <ul className="list-disc pl-8">
                <li className="pb-4">
                  <b>Centralised Security Control:</b> You prefer centralised control over security
                  and session management, keeping sensitive authentication logic and token handling
                  on the server side.
                </li>
                <li className="pb-4">
                  <b>Simplified Frontend:</b> You aim to simplify frontend development by offloading
                  authentication complexity to the backend, allowing the frontend to focus solely on
                  user interface and user experience.
                </li>
                <li className="pb-4">
                  <b>Token Security:</b> Storing and managing tokens on the server side can reduce
                  the risk of token theft or misuse in the client environment, providing an
                  additional layer of security.
                </li>
              </ul>
            </div>
          </div>
          <h2>What Now?</h2>
          <ul className="list-disc pl-8">
            <li>
              Take a look at{' '}
              <a target="_blank" rel="noopener" href="https://github.com/pm7y/React-MSAL-Example">
                the code
              </a>{' '}
              for this site,
            </li>
            <li>Explore the other pages using the links at the top the page,</li>
            <li>
              Read more about the{' '}
              <a
                target="_blank"
                rel="noopener"
                href="https://learn.microsoft.com/en-us/entra/identity-platform/msal-overview">
                Microsoft Authentication Library (MSAL)
              </a>
              ,
            </li>

            <li>
              Look at some other{' '}
              <a target="_blank" rel="noopener" href="https://aka.ms/aadcodesamples">
                MSAL code samples from Microsoft
              </a>
              .
            </li>
          </ul>
        </>
      }
    />
  );
}

export default Welcome;
