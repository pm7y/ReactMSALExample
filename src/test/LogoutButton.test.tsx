import { InteractionStatus } from '@azure/msal-browser';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { LogoutButton } from '../components/LogoutButton';
import { mockAccount } from './msalMock';

// Mock the MSAL React hooks
const mockLogoutRedirect = vi.fn();
const mockGetActiveAccount = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      logoutRedirect: mockLogoutRedirect,
      getActiveAccount: mockGetActiveAccount,
    },
    inProgress: InteractionStatus.None,
    accounts: [mockAccount],
  }),
}));

vi.mock('../infrastructure/auth/useActiveAccount', () => ({
  useActiveAccount: () => mockGetActiveAccount(),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetActiveAccount.mockReturnValue(mockAccount);
  });

  it('renders logout button', () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });

  it('button is not disabled when no interaction is in progress', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /log out/i });
    expect(button).not.toBeDisabled();
  });

  it('calls logoutRedirect when clicked', async () => {
    const user = userEvent.setup();
    mockLogoutRedirect.mockResolvedValue(undefined);

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(mockLogoutRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        account: mockAccount,
        logoutHint: mockAccount.username,
      }),
    );
  });
});
