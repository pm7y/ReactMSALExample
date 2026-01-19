import { InteractionStatus } from '@azure/msal-browser';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { LoginButton } from '../components/LoginButton';
import { mockAccount } from './msalMock';

// Mock the MSAL React hooks
const mockLoginRedirect = vi.fn();
const mockSsoSilent = vi.fn();
const mockSetActiveAccount = vi.fn();
const mockGetActiveAccount = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      loginRedirect: mockLoginRedirect,
      ssoSilent: mockSsoSilent,
      setActiveAccount: mockSetActiveAccount,
      getActiveAccount: mockGetActiveAccount,
    },
    inProgress: InteractionStatus.None,
    accounts: [],
  }),
}));

vi.mock('../infrastructure/auth/useActiveAccount', () => ({
  useActiveAccount: () => mockGetActiveAccount(),
}));

describe('LoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetActiveAccount.mockReturnValue(null);
  });

  it('renders login button', () => {
    render(<LoginButton />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('button is enabled when no interaction is in progress', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: /log in/i });
    expect(button).not.toBeDisabled();
  });

  it('calls loginRedirect when clicked without existing account', async () => {
    const user = userEvent.setup();
    mockLoginRedirect.mockResolvedValue(undefined);

    render(<LoginButton />);
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLoginRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: 'select_account',
      }),
    );
  });

  it('attempts ssoSilent first when account exists', async () => {
    const user = userEvent.setup();
    mockGetActiveAccount.mockReturnValue(mockAccount);
    mockSsoSilent.mockResolvedValue({
      accessToken: 'mock-token',
      account: mockAccount,
    });

    render(<LoginButton />);
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockSsoSilent).toHaveBeenCalled();
    expect(mockSetActiveAccount).toHaveBeenCalled();
  });
});
