import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import marketingService from "services/marketingService";

interface MarketingStrategy {
  strategyId: string;
  title: string;
  description: string;
  expectedROI: string;
  targetAudience: string; // Added target audience for filtering
  cost: number; // Strategy cost in platform currency
}

interface MarketingState {
  strategies: MarketingStrategy[];
  selectedStrategy: MarketingStrategy | null;
  loading: boolean;
  error: string | null;
}

const initialState: MarketingState = {
  strategies: [],
  selectedStrategy: null,
  loading: false,
  error: null,
};

// Fetch available marketing strategies for a seller
export const fetchMarketingStrategies = createAsyncThunk(
  "marketing/fetchMarketingStrategies",
  async (
    params: { sellerId: string; targetAudience: string },
    thunkAPI
  ) => {
    try {
      return await marketingService.getMarketingStrategies(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Apply a selected marketing strategy
export const applyMarketingStrategy = createAsyncThunk(
  "marketing/applyMarketingStrategy",
  async (
    params: { sellerId: string; strategyId: string; budget: number },
    thunkAPI
  ) => {
    try {
      return await marketingService.applyStrategy(params); // Ensure this method exists in `marketingService`
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


const marketingSlice = createSlice({
  name: "marketing",
  initialState,
  reducers: {
    clearSelectedStrategy: (state) => {
      state.selectedStrategy = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketingStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMarketingStrategies.fulfilled,
        (state, action: PayloadAction<MarketingStrategy[]>) => {
          state.strategies = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchMarketingStrategies.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(applyMarketingStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyMarketingStrategy.fulfilled, (state, action: PayloadAction<MarketingStrategy>) => {
        state.selectedStrategy = action.payload;
        state.loading = false;
      })
      .addCase(applyMarketingStrategy.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearSelectedStrategy } = marketingSlice.actions;

export default marketingSlice.reducer;
