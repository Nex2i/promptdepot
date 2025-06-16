import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
  error: string | null;
  supabaseSession: any;
}

const initialState: AuthState = {
  user: null,
  tenants: [],
  currentTenant: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  supabaseSession: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Registration actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ user: User; tenants: Tenant[]; session: any }>
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
      action: PayloadAction<{ user: User; tenants: Tenant[]; session: any }>
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
    },
    setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
      state.currentTenant = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setCurrentTenant,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
