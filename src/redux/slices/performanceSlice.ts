import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import performanceService from "../../services/performanceService"; // Service to fetch performance metrics
import { RootState } from "../store"; // Adjust the path if needed

// Define the shape of the performance metrics state
interface PerformanceMetrics {
  couponsUsed: number;
  couponRevenue: number;
}

interface PerformanceState {
  performance: PerformanceMetrics | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PerformanceState = {
  performance: null,
  loading: false,
  error: null,
};

// Async thunk to fetch performance metrics
export const fetchPerformance = createAsyncThunk<PerformanceMetrics>(
    "performance/fetchPerformance",
    async () => {
      const response = await performanceService.getPerformanceMetrics();
      return response;
    }
  );

// Performance slice
const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    // Define additional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformance.fulfilled, (state, action: PayloadAction<PerformanceMetrics>) => {
        state.performance = action.payload;
        state.loading = false;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch performance metrics";
        state.loading = false;
      });
  },
});

// Selector to get performance metrics from the state
export const selectPerformance = (state: RootState) => state.performance.performance;

// Export the reducer to be added to the store
export default performanceSlice.reducer;
