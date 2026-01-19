# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (http://localhost:5173)
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint with zero warnings allowed
npm run format    # Prettier formatting
```

## Environment Setup

Requires `VITE_MSAL_CLIENT_ID` in `.env` file - this is the Azure AD App Registration client ID.

## Architecture

### Authentication Flow

The app uses MSAL (Microsoft Authentication Library) with redirect-based authentication:

1. **main.tsx** - Initializes MSAL with `createStandardPublicClientApplication`, sets up a custom navigation client for SPA routing, and handles redirect promises
2. **AccessTokenProvider** (`src/infrastructure/auth/`) - React context that manages token acquisition with silent-first strategy, falling back to redirect on failure
3. **useAccessToken** hook - Consumes the access token context for use in components

Token acquisition strategy: Silent refresh on page load (with `forceRefresh: true`), with automatic redirect fallback when interaction is required.

### API Layer

- **graphFetch.ts** - Utility for authenticated MS Graph API calls
- **useGraphUserDetails/useGraphUserPhoto** - Custom hooks that combine `useAccessToken` with API calls

### Routing

Uses TanStack Router with a custom `CustomNavigationClient` that integrates MSAL navigation with the SPA router (prevents full page reloads during auth flows).

Routes: `/` (Welcome), `/claims` (token claims display), `/msgraph` (Graph API demo)

### Project Structure

- `src/infrastructure/auth/` - MSAL configuration and token management
- `src/api/` - Graph API utilities and hooks
- `src/features/` - Page components (Shell, Welcome, Claims, MsGraph)
- `src/components/` - Reusable UI components

## Code Style

- Prettier with Tailwind plugin for class sorting
- Single quotes, 100 char width, bracket same line
- ESLint with react-hooks and react-refresh plugins
- Zero warnings policy (`--max-warnings 0`)
