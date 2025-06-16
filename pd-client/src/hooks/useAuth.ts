import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { authService } from "../lib/authService";

export function useAuth() {
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        setIsLocalLoading(true);

        // Initialize authentication
        await authService.initializeAuth();

        // Set up auth state change listener
        unsubscribe = authService.onAuthStateChange((authenticated) => {
          console.log("Auth state changed in hook:", authenticated);
        });
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLocalLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const refreshAuth = async () => {
    try {
      return await authService.refreshAuth();
    } catch (error) {
      console.error("Refresh auth failed:", error);
      return false;
    }
  };

  const checkAuth = async () => {
    return await authService.isAuthenticated();
  };

  return {
    // Auth state
    user: authState.user,
    tenants: authState.tenants,
    currentTenant: authState.currentTenant,
    isAuthenticated: authState.isAuthenticated,
    supabaseSession: authState.supabaseSession,
    error: authState.error,

    // Loading states
    isInitialized: authState.isInitialized,
    isLoading: isLocalLoading || authState.isLoading,

    // Auth methods
    signOut,
    refreshAuth,
    checkAuth,
  };
}
