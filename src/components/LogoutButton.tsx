import { EndSessionRequest, InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../infrastructure/auth/authConfig';
import { Button } from './Button';

export const LogoutButton = () => {
  const { instance, inProgress } = useMsal();
  const accounts = instance.getAllAccounts();
  const account = accounts ? accounts[0] : null;
  const currentMsalOperationInProgress = inProgress;

  return (
    <Button
      disabled={currentMsalOperationInProgress !== InteractionStatus.None}
      onClick={async () => {
        try {
          await instance.logoutRedirect({
            ...loginRequest,
            account: account,
            logoutHint: account?.username,
          } as EndSessionRequest);
        } catch (redirectError) {
          // TODO handle this error
          console.error('logout error', redirectError);
          throw redirectError;
        }
      }}>
      Log out
    </Button>
  );
};
