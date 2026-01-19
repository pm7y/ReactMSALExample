import { NavigationClient, NavigationOptions } from '@azure/msal-browser';
import { AnyRouter } from '@tanstack/react-router';

export class CustomNavigationClient extends NavigationClient {
  private readonly router: AnyRouter;

  constructor(router: AnyRouter) {
    super();
    this.router = router;
  }

  async navigateInternal(url: string, options: NavigationOptions): Promise<boolean> {
    const relativePath = url.replace(window.location.origin, '');

    try {
      if (options.noHistory) {
        await this.router.navigate({ replace: true, to: relativePath });
      } else {
        await this.router.navigate({ to: relativePath });
      }
    } catch (error) {
      // Log navigation errors but don't throw - fall back to default navigation
      console.error('Router navigation failed:', error);
      // Return true to indicate MSAL should use its default navigation
      return true;
    }

    return false;
  }
}
