import { useState, useEffect } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";
import { supabase } from "../lib/supabaseClient";
import { apiClient } from "../lib/api";
import type { LoginSearchParams } from "../types";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Get redirect parameter from URL search params
  const search = useSearch({ from: "/login" }) as LoginSearchParams;
  const redirectTo = search?.redirect || "/projects";

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/projects" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData.session) {
        dispatch(loginFailure(authError?.message || "Login failed"));
        return;
      }

      // Get user info from our backend
      const response = await apiClient.getMe(authData.session.access_token);

      if (response.error || !response.data) {
        dispatch(
          loginFailure(response.error || "Failed to get user information")
        );
        return;
      }

      // Login successful
      const { user, tenants } = response.data;

      dispatch(
        loginSuccess({
          user,
          tenants,
          session: authData.session,
        })
      );

      // Navigate to redirect URL or projects page after successful login
      navigate({ to: redirectTo });
    } catch (err) {
      console.error(err);
      dispatch(loginFailure("Login failed. Please try again."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-light"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
