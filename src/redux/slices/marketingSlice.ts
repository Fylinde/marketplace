import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import marketingService from 'services/marketingService';

interface MarketingStrategy {
  strategyId: string;
  title: string;
  description: string;
  expectedROI: string;
}

interface MarketingState {
  strategies: MarketingStrategy[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketingState = {
  strategies: [],
  loading: false,
  error: null,
};

export const fetchMarketingStrategies = createAsyncThunk(
  'marketing/fetchMarketingStrategies',
  async (params: { sellerId: string; targetAudience: string }, thunkAPI) => {
    try {
      return await marketingService.getMarketingStrategies(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const marketingSlice = createSlice({
  name: 'marketing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketingStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketingStrategies.fulfilled, (state, action: PayloadAction<MarketingStrategy[]>) => {
        state.strategies = action.payload;
        state.loading = false;
      })
      .addCase(fetchMarketingStrategies.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default marketingSlice.reducer;
