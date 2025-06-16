import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

interface AuthRedirectProps {
  to: string;
  children?: React.ReactNode;
}

export function AuthRedirect({ to, children }: AuthRedirectProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      navigate({ to });
    }
  }, [isAuthenticated, isInitialized, isLoading, navigate, to]);

  // Show loading while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, don't render children (redirect is happening)
  if (isAuthenticated) {
    return null;
  }

  // If not authenticated, render children (login/register form)
  return <>{children}</>;
}
