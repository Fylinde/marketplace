import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sustainabilityService from '../../../services/sustainabilityService';

interface SustainabilityState {
  metrics: {
    emissions: number;
    ecoProducts: number;
    recyclablePackaging: number;
    offsetContributions: number;
  };
  achievements: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SustainabilityState = {
  metrics: {
    emissions: 0,
    ecoProducts: 0,
    recyclablePackaging: 0,
    offsetContributions: 0,
  },
  achievements: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSustainabilityMetrics = createAsyncThunk(
  'sustainability/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      return await sustainabilityService.getSustainabilityMetrics();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSustainabilityAchievements = createAsyncThunk(
  'sustainability/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      return await sustainabilityService.getSustainabilityAchievements();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitSustainabilityGoal = createAsyncThunk(
  'sustainability/submitGoal',
  async (payload: { goal: string; value: number }, { rejectWithValue }) => {
    try {
      return await sustainabilityService.submitSustainabilityGoal(payload);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const sustainabilitySlice = createSlice({
  name: 'sustainability',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSustainabilityMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSustainabilityMetrics.fulfilled, (state, { payload }) => {
        state.metrics = payload;
        state.loading = false;
      })
      .addCase(fetchSustainabilityMetrics.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      })
      .addCase(fetchSustainabilityAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSustainabilityAchievements.fulfilled, (state, { payload }) => {
        state.achievements = payload;
        state.loading = false;
      })
      .addCase(fetchSustainabilityAchievements.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      })
      .addCase(submitSustainabilityGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSustainabilityGoal.fulfilled, (state, { payload }) => {
        // Assume backend returns updated metrics or goal status.
        state.metrics = payload.metrics || state.metrics;
        state.loading = false;
      })
      .addCase(submitSustainabilityGoal.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      });
  },
});

export default sustainabilitySlice.reducer;
