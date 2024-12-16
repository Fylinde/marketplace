import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../../services/dashboardService';

interface DashboardState {
  salesData: { date: string; sales: number }[];
  inventoryData: { status: string; value: number; color: string }[];
  trafficData: { totalVisitors: number; conversionRate: number };
  achievements: string[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  salesData: [],
  inventoryData: [],
  trafficData: { totalVisitors: 0, conversionRate: 0 },
  achievements: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const [salesData, inventoryData, trafficData, achievements] = await Promise.all([
        dashboardService.getSalesData(),
        dashboardService.getInventoryData(),
        dashboardService.getTrafficData(),
        dashboardService.getAchievements(),
      ]);
      return { salesData, inventoryData, trafficData, achievements };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, { payload }) => {
        state.salesData = payload.salesData;
        state.inventoryData = payload.inventoryData;
        state.trafficData = payload.trafficData;
        state.achievements = payload.achievements;
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
