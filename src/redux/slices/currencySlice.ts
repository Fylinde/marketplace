import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Types
interface ExchangeRate {
  baseCurrency: string;
  rates: Record<string, number>;
}

interface CurrencyState {
  exchangeRates: ExchangeRate | null;
  baseCurrency: string;
  buyerCurrency: string;
  sellerCurrency: string;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: CurrencyState = {
  exchangeRates: null,
  baseCurrency: "USD", // Default base currency for the marketplace
  buyerCurrency: "USD",
  sellerCurrency: "USD",
  loading: false,
  error: null,
};

// Async Thunk: Fetch Exchange Rates
export const fetchExchangeRates = createAsyncThunk(
  "currency/fetchExchangeRates",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/exchange-rates"); // Replace with your API endpoint
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch exchange rates");
    }
  }
);

// Slice
const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setBuyerCurrency(state, action) {
      state.buyerCurrency = action.payload;
    },
    setSellerCurrency(state, action) {
      state.sellerCurrency = action.payload;
    },
    convertPrice: (
      state,
      action: { payload: { amount: number; fromCurrency: string; toCurrency: string } }
    ) => {
      const { amount, fromCurrency, toCurrency } = action.payload;
      if (!state.exchangeRates) return; // Ensure exchange rates are loaded
      const rate = state.exchangeRates.rates[toCurrency] / state.exchangeRates.rates[fromCurrency];
      action.payload = { ...action.payload, convertedAmount: amount * rate };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.exchangeRates = action.payload;
        state.loading = false;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export Actions
export const { setBuyerCurrency, setSellerCurrency, convertPrice } = currencySlice.actions;

// Export Reducer
export default currencySlice.reducer;
