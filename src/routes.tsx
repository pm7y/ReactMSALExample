import { createRootRoute, createRoute } from '@tanstack/react-router';
import Claims from './features/Claims.tsx';
import MsGraph from './features/MsGraph.tsx';
import { Shell } from './features/Shell.tsx';
import Index from './features/Welcome.tsx';

const rootRoute = createRootRoute({
  component: () => {
    return <Shell />;
  },
});

export function getRoutes() {
  const routes = [
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => <Index />,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/claims',
      component: () => <Claims />,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/msgraph',
      component: () => <MsGraph />,
    }),
  ];

  return rootRoute.addChildren(routes);
}
