import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import currencyService from "../../../services/currencyService";

interface ExchangeRate {
  baseCurrency: string;
  rates: Record<string, number>;
}

interface LockedRate {
  rate: number;
  expiresAt: string; // ISO timestamp for expiration
}

interface CurrencyState {
  exchangeRates: ExchangeRate | null;
  baseCurrency: string;
  buyerCurrency: string;
  sellerCurrency: string;
  lockedRate: LockedRate | null;
  feeDetails: { conversionFee: number } | null; // Fee transparency
  loading: boolean;
  error: string | null;
}

const initialState: CurrencyState = {
  exchangeRates: null,
  baseCurrency: "USD",
  buyerCurrency: "USD",
  sellerCurrency: "USD",
  lockedRate: null,
  feeDetails: null,
  loading: false,
  error: null,
};

// Update seller currency thunk
export const updateSellerCurrency = createAsyncThunk<
  any, // Resolved value type
  string, // Argument type
  { rejectValue: string }
>("currency/updateSellerCurrency", async (currency, thunkAPI) => {
  try {
    const response = await currencyService.updateSellerCurrency(currency);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to update seller currency.");
  }
});

// Fetch exchange rates
export const fetchExchangeRates = createAsyncThunk(
  "currency/fetchExchangeRates",
  async (_, thunkAPI) => {
    try {
      return await currencyService.getExchangeRates();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch exchange rates.");
    }
  }
);

// Lock in an exchange rate
export const lockExchangeRate = createAsyncThunk(
  "currency/lockExchangeRate",
  async (
    { fromCurrency, toCurrency }: { fromCurrency: string; toCurrency: string },
    thunkAPI
  ) => {
    try {
      return await currencyService.lockExchangeRate(fromCurrency, toCurrency);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to lock exchange rate.");
    }
  }
);

// Calculate transaction fees
export const calculateFees = createAsyncThunk(
  "currency/calculateFees",
  async (
    { amount, fromCurrency, toCurrency }: { amount: number; fromCurrency: string; toCurrency: string },
    thunkAPI
  ) => {
    try {
      return await currencyService.calculateConversionFee(amount, fromCurrency, toCurrency);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to calculate fees.");
    }
  }
);

// Slice
const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setBuyerCurrency(state, action: PayloadAction<string>) {
      state.buyerCurrency = action.payload;
    },
    setSellerCurrency(state, action: PayloadAction<string>) {
      state.sellerCurrency = action.payload;
    },
    updateCurrencyForRegion(state, action: PayloadAction<string>) {
      const regionCurrencyMapping: Record<string, string> = {
        US: "USD",
        EU: "EUR",
        IN: "INR",
      };
      const region = action.payload;
      state.buyerCurrency = regionCurrencyMapping[region] || state.baseCurrency;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSellerCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerCurrency = action.payload;
      })
      .addCase(updateSellerCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred while updating seller currency.";
      })

    builder
      // Fetch Exchange Rates
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
      })
      // Lock Exchange Rate
      .addCase(lockExchangeRate.fulfilled, (state, action) => {
        state.lockedRate = action.payload;
      })
      // Calculate Fees
      .addCase(calculateFees.fulfilled, (state, action) => {
        state.feeDetails = action.payload;
      });
  },
});

export const { setBuyerCurrency, setSellerCurrency, updateCurrencyForRegion } =
  currencySlice.actions;

export default currencySlice.reducer;
