import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import exchangeRateService from "services/exchangeRateService";

interface ExchangeRate {
  baseCurrency: string;
  rates: Record<string, number>;
  updatedAt: string; // Timestamp of the last update
}

interface HistoricalRate {
  date: string;
  rates: Record<string, number>;
}

interface ExchangeRateState {
  currentRates: ExchangeRate | null;
  historicalRates: HistoricalRate[];
  loading: boolean;
  error: string | null;
}

const initialState: ExchangeRateState = {
  currentRates: null,
  historicalRates: [],
  loading: false,
  error: null,
};

// Async Thunks

// Fetch current exchange rates
export const fetchCurrentExchangeRates = createAsyncThunk(
  "exchangeRate/fetchCurrentExchangeRates",
  async (_, thunkAPI) => {
    try {
      return await exchangeRateService.getCurrentExchangeRates();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch current exchange rates.");
    }
  }
);

// Fetch historical exchange rates
export const fetchHistoricalExchangeRates = createAsyncThunk(
  "exchangeRate/fetchHistoricalExchangeRates",
  async (date: string, thunkAPI) => {
    try {
      return await exchangeRateService.getHistoricalExchangeRates(date);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch historical exchange rates.");
    }
  }
);

// Slice
const exchangeRateSlice = createSlice({
  name: "exchangeRate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Current Rates
      .addCase(fetchCurrentExchangeRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentExchangeRates.fulfilled, (state, action) => {
        state.currentRates = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Historical Rates
      .addCase(fetchHistoricalExchangeRates.fulfilled, (state, action) => {
        state.historicalRates.push(action.payload);
      });
  },
});

export default exchangeRateSlice.reducer;
