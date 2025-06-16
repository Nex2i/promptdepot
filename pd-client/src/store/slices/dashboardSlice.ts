import { createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  // Keep other dashboard-specific state here if needed in the future
  // For now, this can be minimal or empty
}

const initialState: DashboardState = {};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Add dashboard-specific actions here if needed in the future
  },
});

export const {} = dashboardSlice.actions;

export default dashboardSlice.reducer;
