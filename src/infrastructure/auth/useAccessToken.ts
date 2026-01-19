import { useContext } from 'react';
import { AccessTokenContext } from './AccessTokenProvider';

export function useAccessToken() {
  const context = useContext(AccessTokenContext);
  if (context === undefined) {
    throw new Error('useAccessToken must be used within AccessTokenProvider');
  }
  return context;
}
