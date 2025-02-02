import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import cryptoService from "../../../services/cryptoService";

interface CryptoPayment {
  orderId: string;
  buyerCryptoAmount: number;
  sellerFiatAmount: number;
  cryptoCurrency: string;
  fiatCurrency: string;
  exchangeRate: number;
  status: "Pending" | "Confirmed" | "Failed";
  transactionHash?: string;
}

interface Wallet {
  name: string;
  address: string;
  connected: boolean;
}

interface CryptoState {
  wallets: Wallet[];
  payments: CryptoPayment[];
  selectedCrypto: string;
  exchangeRates: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  wallets: [],
  payments: [],
  selectedCrypto: "BTC",
  exchangeRates: {},
  loading: false,
  error: null,
};

// Async Thunks

// Fetch supported wallets
export const fetchWallets = createAsyncThunk(
  "crypto/fetchWallets",
  async (_, thunkAPI) => {
    try {
      return await cryptoService.getWallets();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch wallets.");
    }
  }
);

// Fetch crypto exchange rates
export const fetchCryptoExchangeRates = createAsyncThunk(
  "crypto/fetchCryptoExchangeRates",
  async (_, thunkAPI) => {
    try {
      return await cryptoService.getExchangeRates();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch crypto exchange rates.");
    }
  }
);

// Process a crypto payment
export const processCryptoPayment = createAsyncThunk(
  "crypto/processCryptoPayment",
  async (
    {
      orderId,
      buyerCryptoAmount,
      sellerFiatAmount,
      cryptoCurrency,
      fiatCurrency,
    }: CryptoPayment,
    thunkAPI
  ) => {
    try {
      return await cryptoService.processPayment({
        orderId,
        buyerCryptoAmount,
        sellerFiatAmount,
        cryptoCurrency,
        fiatCurrency,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to process crypto payment.");
    }
  }
);

// Slice
const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    setSelectedCrypto(state, action: PayloadAction<string>) {
      state.selectedCrypto = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallets
      .addCase(fetchWallets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        state.wallets = action.payload;
        state.loading = false;
      })
      .addCase(fetchWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Crypto Exchange Rates
      .addCase(fetchCryptoExchangeRates.fulfilled, (state, action) => {
        state.exchangeRates = action.payload;
      })
      // Process Crypto Payment
      .addCase(processCryptoPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
      })
      .addCase(processCryptoPayment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCrypto } = cryptoSlice.actions;

export default cryptoSlice.reducer;
