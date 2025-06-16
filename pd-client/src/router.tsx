import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import { TenantProjectsList } from "./components/TenantProjectsList";

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

const tenantProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: TenantProjectsList,
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
  tenantProjectsRoute,
]);

// Create the router
export const router = createRouter({ routeTree });
