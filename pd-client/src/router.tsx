import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  type ParsedLocation,
} from "@tanstack/react-router";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import { ProjectView } from "./components/ProjectView";
import { authService } from "./lib/authService";
import { TenantProjectsList } from "./components/TenantProjectsList";
import { LandingPage } from "./components/LandingPage";
import { RootLayout } from "./components/RootLayout";

// Shared auth guard functions
const authGuards = {
  /**
   * For protected routes - requires authentication
   * Redirects to login if not authenticated
   */
  requireAuth: async ({ location }: { location: ParsedLocation }) => {
    const isAuthenticated = await authService.isAuthenticated();

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },

  /**
   * For public routes - redirects to dashboard if already authenticated
   * Prevents authenticated users from accessing login/register pages
   */
  redirectIfAuthenticated: async () => {
    const isAuthenticated = await authService.isAuthenticated();

    if (isAuthenticated) {
      throw redirect({
        to: "/projects",
      });
    }
  },

  /**
   * For landing page - smart redirect based on auth status
   * Authenticated users go to dashboard, unauthenticated see landing page
   */
  smartRedirect: async () => {
    const isAuthenticated = await authService.isAuthenticated();

    if (isAuthenticated) {
      throw redirect({
        to: "/projects",
      });
    }
    // If not authenticated, let the component render normally
  },
};

// Create the root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Create child routes with shared auth guards
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
  beforeLoad: authGuards.redirectIfAuthenticated,
});

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Registration,
  beforeLoad: authGuards.redirectIfAuthenticated,
});

// Protected route for dashboard/projects
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: TenantProjectsList,
  beforeLoad: authGuards.requireAuth,
});

// Protected route for individual project view
const projectViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$projectId",
  component: ProjectView,
  beforeLoad: authGuards.requireAuth,
});

// Create index route that checks auth and redirects appropriately
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: authGuards.smartRedirect,
  component: LandingPage,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registrationRoute,
  dashboardRoute,
  projectViewRoute,
]);

// Create the router
export const router = createRouter({ routeTree });
