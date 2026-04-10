import { AccountInfo } from '@azure/msal-browser';
import { useAccount } from '@azure/msal-react';

// Wraps msal-react's useAccount() — called with no identifiers it tracks the active account
// reactively via MSAL event callbacks, so consumers re-render on login, logout, and
// setActiveAccount. Calling instance.getActiveAccount() directly in render is not reactive.
export function useActiveAccount(): AccountInfo | null {
  return useAccount();
}
