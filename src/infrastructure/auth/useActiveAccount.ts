import { AccountInfo } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';

/**
 * Custom hook that retrieves the active account from the MSAL instance.
 * Uses getActiveAccount() to respect the account set by setActiveAccount().
 *
 * @returns The active account if available, otherwise null
 */
export function useActiveAccount(): AccountInfo | null {
  const { instance } = useMsal();
  return instance.getActiveAccount();
}
