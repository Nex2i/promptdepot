import { supabase } from "./supabaseClient";
import { apiClient } from "./api";
import { store } from "../store";
import {
  authInitStart,
  authInitSuccess,
  authInitFailure,
  loginSuccess,
  logout,
  refreshStart,
  refreshSuccess,
  refreshFailure,
} from "../store/slices/authSlice";

class AuthService {
  private authCheckPromise: Promise<boolean> | null = null;
  private isCheckingAuth = false;

  /**
   * Initialize authentication on app start
   */
  async initializeAuth(): Promise<boolean> {
    if (this.authCheckPromise) {
      return this.authCheckPromise;
    }

    store.dispatch(authInitStart());
    this.authCheckPromise = this.performAuthCheck();

    try {
      const result = await this.authCheckPromise;
      store.dispatch(authInitSuccess());
      return result;
    } catch (error) {
      store.dispatch(
        authInitFailure(
          error instanceof Error ? error.message : "Auth initialization failed"
        )
      );
      return false;
    } finally {
      this.authCheckPromise = null;
    }
  }

  /**
   * Check if user is authenticated (prevents race conditions)
   * This method ensures auth data is loaded into the store if valid
   */
  async isAuthenticated(): Promise<boolean> {
    // If we're already checking, return the existing promise
    if (this.authCheckPromise) {
      return this.authCheckPromise;
    }

    // If we have a valid session in store and it's recent, return true
    const state = store.getState();
    if (state.auth.isAuthenticated && state.auth.supabaseSession) {
      const session = state.auth.supabaseSession;
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();

      // If token expires in more than 5 minutes, consider it valid
      if (expiresAt.getTime() - now.getTime() > 5 * 60 * 1000) {
        return true;
      }
    }

    // Otherwise, perform full auth check
    this.authCheckPromise = this.performAuthCheck();
    const result = await this.authCheckPromise;
    this.authCheckPromise = null; // Reset promise after completion
    return result;
  }

  /**
   * Quick auth check for route guards (optimized for speed)
   * Returns true/false without loading data into store if not needed
   */
  async hasValidSession(): Promise<boolean> {
    try {
      // Quick check of existing Redux state first
      const state = store.getState();
      if (state.auth.isAuthenticated && state.auth.supabaseSession) {
        const session = state.auth.supabaseSession;
        if (session.expires_at) {
          const expiresAt = new Date(session.expires_at * 1000);
          const now = new Date();

          // If token expires in more than 5 minutes, consider it valid
          if (expiresAt.getTime() - now.getTime() > 5 * 60 * 1000) {
            return true;
          }
        }
      }

      // If no valid state, check Supabase session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session || !session.expires_at) {
        return false;
      }

      // Quick expiry check
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();

      return expiresAt.getTime() > now.getTime();
    } catch (error) {
      console.error("Quick auth check failed:", error);
      return false;
    }
  }

  /**
   * Perform the actual authentication check and load data into store
   */
  private async performAuthCheck(): Promise<boolean> {
    if (this.isCheckingAuth) {
      return false;
    }

    this.isCheckingAuth = true;

    try {
      // Step 1: Check Supabase session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Supabase session error:", sessionError);
        store.dispatch(logout());
        return false;
      }

      if (!session) {
        store.dispatch(logout());
        return false;
      }

      // Step 2: Validate session with backend
      const response = await apiClient.getMe(session.access_token);

      if (response.error || !response.data) {
        console.error("Backend auth validation failed:", response.error);

        // If backend validation fails, also clear Supabase session
        await supabase.auth.signOut();
        store.dispatch(logout());
        return false;
      }

      // Step 3: Update Redux store with fresh data
      const { user, tenants } = response.data;

      store.dispatch(
        loginSuccess({
          user,
          tenants,
          session,
        })
      );

      return true;
    } catch (error) {
      console.error("Auth check failed:", error);

      // Clear everything on error
      await supabase.auth.signOut();
      store.dispatch(logout());
      return false;
    } finally {
      this.isCheckingAuth = false;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshAuth(): Promise<boolean> {
    store.dispatch(refreshStart());

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();

      if (error || !session) {
        console.error("Token refresh failed:", error);
        store.dispatch(
          refreshFailure(error?.message || "Token refresh failed")
        );
        return false;
      }

      // Validate refreshed session with backend
      const response = await apiClient.getMe(session.access_token);

      if (response.error || !response.data) {
        console.error(
          "Backend validation after refresh failed:",
          response.error
        );
        store.dispatch(
          refreshFailure(response.error || "Backend validation failed")
        );
        return false;
      }

      // Update store with fresh data
      const { user, tenants } = response.data;
      store.dispatch(
        refreshSuccess({
          user,
          tenants,
          session,
        })
      );

      return true;
    } catch (error) {
      console.error("Auth refresh failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Auth refresh failed";
      store.dispatch(refreshFailure(errorMessage));
      return false;
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase signout error:", error);
    } finally {
      store.dispatch(logout());
      this.authCheckPromise = null;
      this.isCheckingAuth = false;
    }
  }

  /**
   * Listen for auth state changes
   */
  onAuthStateChange(callback: (authenticated: boolean) => void): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "Auth state changed:",
        event,
        session ? "session exists" : "no session"
      );

      if (event === "SIGNED_OUT" || !session) {
        store.dispatch(logout());
        callback(false);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Validate session with backend
        const response = await apiClient.getMe(session.access_token);

        if (response.error || !response.data) {
          console.error(
            "Backend validation failed on auth state change:",
            response.error
          );
          await supabase.auth.signOut();
          store.dispatch(logout());
          callback(false);
          return;
        }

        // Update store
        const { user, tenants } = response.data;
        store.dispatch(
          loginSuccess({
            user,
            tenants,
            session,
          })
        );

        callback(true);
      }
    });

    // Return unsubscribe function
    return () => subscription.unsubscribe();
  }

  /**
   * Get current session token
   */
  async getSessionToken(): Promise<string | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  }
}

export const authService = new AuthService();
