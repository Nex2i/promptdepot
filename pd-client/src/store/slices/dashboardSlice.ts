import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Project {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  selectedProject: Project | null;
}

const initialState: DashboardState = {
  projects: [],
  isLoading: false,
  error: null,
  selectedProject: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    fetchProjectsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProjectsSuccess: (state, action: PayloadAction<Project[]>) => {
      state.isLoading = false;
      state.projects = action.payload;
      state.error = null;
    },
    fetchProjectsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectProject: (state, action: PayloadAction<Project>) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  selectProject,
  clearSelectedProject,
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
