import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import taxService from '../../../services/taxService';

interface TaxRate {
  id: string;
  country: string;
  region?: string;
  category?: string;
  rate: number; // Percentage value (e.g., 10%)
}

interface SellerTaxConfig {
  region: string;
  rate: number;
}

interface TaxState {
  taxRates: TaxRate[];
  sellerTaxConfigs: SellerTaxConfig[];
  supportedCountries: string[];
  loading: boolean;
  error: string | null;
}

const initialState: TaxState = {
  taxRates: [],
  sellerTaxConfigs: [],
  supportedCountries: [],
  loading: false,
  error: null,
};

// Fetch tax rates
export const fetchTaxRates = createAsyncThunk(
  'tax/fetchTaxRates',
  async (params: { country: string; region?: string; category?: string }, thunkAPI) => {
    try {
      return await taxService.getTaxRates(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch seller tax configurations
export const fetchSellerTaxConfigurations = createAsyncThunk(
  'tax/fetchSellerTaxConfigurations',
  async (sellerId: string, thunkAPI) => {
    try {
      return await taxService.getSellerTaxConfigurations(sellerId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch supported countries
export const fetchSupportedCountries = createAsyncThunk(
  'tax/fetchSupportedCountries',
  async (_, thunkAPI) => {
    try {
      return await taxService.getSupportedCountries();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const saveSellerTaxInformation = createAsyncThunk(
  'tax/saveSellerTaxInformation',
  async (params: { sellerId: string; taxInfo: { taxId: string; vatNumber?: string; country: string } }, thunkAPI) => {
    try {
      return await taxService.saveSellerTaxInformation(params.sellerId, params.taxInfo);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxRates.fulfilled, (state, action: PayloadAction<TaxRate[]>) => {
        state.taxRates = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaxRates.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellerTaxConfigurations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerTaxConfigurations.fulfilled, (state, action: PayloadAction<SellerTaxConfig[]>) => {
        state.sellerTaxConfigs = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellerTaxConfigurations.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchSupportedCountries.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.supportedCountries = action.payload;
      });
  },
});

export default taxSlice.reducer;
