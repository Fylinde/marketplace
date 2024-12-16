// Enhanced performanceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import performanceService, { PerformanceMetrics } from "../../../services/performanceService";
import { RootState } from "../../store";

// Define the shape of the performance metrics state
interface PerformanceState {
  metrics: PerformanceMetrics | null; // Aligns directly with PerformanceMetrics
  loading: boolean;
  error: string | null;
}

// Initial state
// Initial state
const initialState: PerformanceState = {
  metrics: null,
  loading: false,
  error: null,
};


// Async thunk to fetch performance metrics
export const fetchPerformance = createAsyncThunk<PerformanceMetrics>(
  "performance/fetchPerformance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await performanceService.getPerformanceMetrics();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch performance metrics");
    }
  }
);

// Async thunk to fetch detailed revenue breakdown
export const fetchRevenueBreakdown = createAsyncThunk(
  "performance/fetchRevenueBreakdown",
  async (_, { rejectWithValue }) => {
    try {
      const response = await performanceService.getRevenueBreakdown();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch revenue breakdown");
    }
  }
);

// Performance slice
const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // Fetch Performance Metrics
    .addCase(fetchPerformance.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchPerformance.fulfilled, (state, action: PayloadAction<PerformanceMetrics>) => {
      state.metrics = action.payload; // Assign to metrics
      state.loading = false;
    })
    .addCase(fetchPerformance.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    })
      .addCase(fetchRevenueBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueBreakdown.fulfilled, (state, action: PayloadAction<any>) => {
        if (state.metrics) {
          state.metrics = {
            ...state.metrics,
            revenueBreakdown: action.payload, // Add revenue breakdown to metrics
          };
        }
        state.loading = false;
      })
      .addCase(fetchRevenueBreakdown.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

// Selector to get performance metrics from the state
export const selectPerformanceMetrics = (state: RootState) => state.performance.metrics;


// Export the reducer to be added to the store
export default performanceSlice.reducer;