/// <reference types="vite/client" />

// Register the router instance for better type-safety
import { router } from "./router";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
