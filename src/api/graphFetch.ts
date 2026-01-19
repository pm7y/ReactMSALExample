/** Graph API endpoint path starting with '/' */
type GraphEndpoint = `/${string}`;

/**
 * Utility function for making authenticated requests to Microsoft Graph API.
 * Handles the common pattern of creating requests with Authorization headers.
 */
export async function graphFetch(
  endpoint: GraphEndpoint,
  accessToken: string,
  options?: { contentType?: string; signal?: AbortSignal },
): Promise<Response> {
  // Runtime validation for dynamic endpoints (template literal type provides compile-time check)
  if (!endpoint || !endpoint.startsWith('/')) {
    throw new Error(`Invalid endpoint: must start with '/'. Received: ${endpoint}`);
  }

  // Validate access token is present
  // Note: Don't validate JWT format - Microsoft returns opaque (v1) tokens for some configurations
  if (!accessToken || !accessToken.trim()) {
    throw new Error('Access token is required');
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
  });

  if (options?.contentType) {
    headers.set('Content-Type', options.contentType);
  }

  return fetch(`https://graph.microsoft.com/v1.0${endpoint}`, {
    method: 'GET',
    headers,
    signal: options?.signal,
  });
}
