import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { AccessTokenContext } from '../infrastructure/auth/AccessTokenProvider';
import { useAccessToken } from '../infrastructure/auth/useAccessToken';

describe('useAccessToken', () => {
  it('throws error when used outside AccessTokenProvider', () => {
    expect(() => renderHook(() => useAccessToken())).toThrow(
      'useAccessToken must be used within AccessTokenProvider',
    );
  });

  it('returns null when context value is null', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AccessTokenContext.Provider value={null}>{children}</AccessTokenContext.Provider>
    );

    const { result } = renderHook(() => useAccessToken(), { wrapper });
    expect(result.current).toBe(null);
  });

  it('returns access token when context has token', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AccessTokenContext.Provider value="test-access-token">{children}</AccessTokenContext.Provider>
    );

    const { result } = renderHook(() => useAccessToken(), { wrapper });
    expect(result.current).toBe('test-access-token');
  });
});
