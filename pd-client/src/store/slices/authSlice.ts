import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SupabaseSession } from "../../types";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface Tenant {
  id: string;
  name: string;
  isSuperUser: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  supabaseSession: SupabaseSession | null;
}

const initialState: AuthState = {
  user: null,
  tenants: [],
  currentTenant: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  supabaseSession: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Initialization actions
    authInitStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authInitSuccess: (state) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.error = null;
    },
    authInitFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.error = action.payload;
    },
    // Registration actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        tenants: Tenant[];
        session: SupabaseSession;
      }>
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tenants = action.payload.tenants;
      state.currentTenant = action.payload.tenants[0] || null;
      state.isAuthenticated = true;
      state.supabaseSession = action.payload.session;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        tenants: Tenant[];
        session: SupabaseSession;
      }>
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tenants = action.payload.tenants;
      state.currentTenant = action.payload.tenants[0] || null;
      state.isAuthenticated = true;
      state.supabaseSession = action.payload.session;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    // General actions
    logout: (state) => {
      state.user = null;
      state.tenants = [];
      state.currentTenant = null;
      state.isAuthenticated = false;
      state.supabaseSession = null;
      state.error = null;
      // Keep isInitialized true so we don't show loading again
    },
    setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
      state.currentTenant = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Session refresh
    refreshStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    refreshSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        tenants: Tenant[];
        session: SupabaseSession;
      }>
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tenants = action.payload.tenants;
      state.currentTenant = action.payload.tenants[0] || null;
      state.isAuthenticated = true;
      state.supabaseSession = action.payload.session;
      state.error = null;
    },
    refreshFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.tenants = [];
      state.currentTenant = null;
      state.supabaseSession = null;
    },
  },
});

export const {
  authInitStart,
  authInitSuccess,
  authInitFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setCurrentTenant,
  clearError,
  refreshStart,
  refreshSuccess,
  refreshFailure,
} = authSlice.actions;
export default authSlice.reducer;
