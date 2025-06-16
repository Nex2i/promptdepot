import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-400">Initializing authentication</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
