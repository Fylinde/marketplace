import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import exchangeRateService from "../../../services/exchangeRateService";

// Types
export interface ExchangeRate {
  baseCurrency: string;
  rates: Record<string, number>;
  updatedAt: string; // Timestamp of the last update
}

export interface HistoricalRate {
  date: string;
  rates: Record<string, number>;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
}

interface ExchangeRateState {
  rates: Record<string, number>; // A dictionary of exchange rates
  baseCurrency: string;
  currentRates: ExchangeRate | null;
  historicalRates: HistoricalRate[];
  conversionResult: ConversionResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExchangeRateState = {
  rates: {}, // Default to an empty object
  baseCurrency: "USD",
  currentRates: null,
  historicalRates: [],
  conversionResult: null,
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
  async ({ startDate, endDate }: { startDate: string; endDate: string }, thunkAPI) => {
    try {
      return await exchangeRateService.getHistoricalExchangeRates({ startDate, endDate });
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch historical exchange rates.");
    }
  }
);


// Convert currency
export const convertCurrency = createAsyncThunk(
  "exchangeRate/convertCurrency",
  async (
    payload: { amount: number; from: string; to: string },
    thunkAPI
  ) => {
    try {
      return await exchangeRateService.convertCurrency(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue("Currency conversion failed.");
    }
  }
);

// Slice
const exchangeRateSlice = createSlice({
  name: "exchangeRate",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearConversionResult: (state) => {
      state.conversionResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchCurrentExchangeRates.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCurrentExchangeRates.fulfilled, (state, action) => {
      state.rates = action.payload.rates;
      state.baseCurrency = action.payload.baseCurrency;
      state.loading = false;
    })
    .addCase(fetchCurrentExchangeRates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch exchange rates";
    })

      builder
      // Handle pending state for historical rates
      .addCase(fetchHistoricalExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for historical rates
      .addCase(
        fetchHistoricalExchangeRates.fulfilled,
        (state, action: PayloadAction<HistoricalRate[]>) => {
          state.historicalRates = [...state.historicalRates, ...action.payload];
          state.loading = false;
        }
      )
      // Handle rejected state for historical rates
      .addCase(fetchHistoricalExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Convert Currency
      .addCase(convertCurrency.pending, (state) => {
        state.loading = true;
      })
      .addCase(convertCurrency.fulfilled, (state, action: PayloadAction<ConversionResult>) => {
        state.conversionResult = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(convertCurrency.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const { clearError, clearConversionResult } = exchangeRateSlice.actions;

// Reducer
export default exchangeRateSlice.reducer;
