import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
  redirect,
} from "@tanstack/react-router";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import { Dashboard } from "./components/Dashboard";
import { store } from "./store";

// Root route component
const RootComponent = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Outlet />
    </div>
  );
};

// Create the root route
const rootRoute = createRootRoute({
  component: RootComponent,
});

// Create child routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Registration,
});

// Protected route for dashboard/projects
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: Dashboard,
  beforeLoad: ({ location }) => {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated;

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

// Create index route that redirects to projects
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome to PromptDepot</h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  },
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registrationRoute,
  dashboardRoute,
]);

// Create the router
export const router = createRouter({ routeTree });
