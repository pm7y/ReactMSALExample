import { AccountInfo, EventType, InteractionStatus, IPublicClientApplication } from '@azure/msal-browser';

export const mockAccount: AccountInfo = {
  homeAccountId: 'test-home-account-id',
  localAccountId: 'test-local-account-id',
  environment: 'login.microsoftonline.com',
  tenantId: 'test-tenant-id',
  username: 'testuser@example.com',
  name: 'Test User',
};

function createMockLogger() {
  return {
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    verbose: vi.fn(),
    trace: vi.fn(),
    infoPii: vi.fn(),
    verbosePii: vi.fn(),
    tracePii: vi.fn(),
    errorPii: vi.fn(),
    warningPii: vi.fn(),
    isPiiLoggingEnabled: vi.fn().mockReturnValue(false),
    clone: vi.fn(),
  };
}

export function createMockMsalInstance(
  overrides: Partial<IPublicClientApplication> = {},
): IPublicClientApplication {
  const mockLogger = createMockLogger();

  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    acquireTokenSilent: vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      account: mockAccount,
    }),
    acquireTokenPopup: vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      account: mockAccount,
    }),
    acquireTokenRedirect: vi.fn().mockResolvedValue(undefined),
    acquireTokenByCode: vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      account: mockAccount,
    }),
    getAllAccounts: vi.fn().mockReturnValue([mockAccount]),
    getActiveAccount: vi.fn().mockReturnValue(mockAccount),
    setActiveAccount: vi.fn(),
    getAccountByHomeId: vi.fn().mockReturnValue(mockAccount),
    getAccountByLocalId: vi.fn().mockReturnValue(mockAccount),
    getAccountByUsername: vi.fn().mockReturnValue(mockAccount),
    loginPopup: vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      account: mockAccount,
    }),
    loginRedirect: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    logoutPopup: vi.fn().mockResolvedValue(undefined),
    logoutRedirect: vi.fn().mockResolvedValue(undefined),
    ssoSilent: vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      account: mockAccount,
    }),
    addEventCallback: vi.fn().mockReturnValue('callback-id'),
    removeEventCallback: vi.fn(),
    addPerformanceCallback: vi.fn().mockReturnValue('perf-callback-id'),
    removePerformanceCallback: vi.fn().mockReturnValue(true),
    enableAccountStorageEvents: vi.fn(),
    disableAccountStorageEvents: vi.fn(),
    handleRedirectPromise: vi.fn().mockResolvedValue(null),
    getTokenCache: vi.fn().mockReturnValue({
      loadExternalTokens: vi.fn(),
    }),
    clearCache: vi.fn().mockResolvedValue(undefined),
    getLogger: vi.fn().mockReturnValue(mockLogger),
    setLogger: vi.fn(),
    setNavigationClient: vi.fn(),
    hydrateCache: vi.fn().mockResolvedValue(undefined),
    initializeWrapperLibrary: vi.fn(),
    getConfiguration: vi.fn().mockReturnValue({
      auth: {
        clientId: 'test-client-id',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: '/',
      },
    }),
    ...overrides,
  } as unknown as IPublicClientApplication;
}

export function createMsalContextValue(
  instance: IPublicClientApplication,
  inProgress: InteractionStatus = InteractionStatus.None,
  accounts: AccountInfo[] = [mockAccount],
) {
  return {
    instance,
    inProgress,
    accounts,
    logger: instance.getLogger(),
  };
}

export function triggerMsalEvent(
  instance: ReturnType<typeof createMockMsalInstance>,
  eventType: EventType,
  payload: unknown,
) {
  const callback = (instance.addEventCallback as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
  if (callback) {
    callback({ eventType, payload });
  }
}
