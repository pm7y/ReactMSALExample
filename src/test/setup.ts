import '@testing-library/jest-dom/vitest';

// Mock environment variables for tests
vi.stubEnv('VITE_MSAL_CLIENT_ID', 'test-client-id');
