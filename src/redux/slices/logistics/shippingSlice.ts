import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import shippingService from '../../../services/shippingService';
import { getLocalizedText } from '../../../utils/localizationUtils';


export interface ShippingData {
  id: string;
  name: string;
  rate: number;
  currency: string;
  estimatedDelivery: string;
}
// Define the types
interface ShippingState {
  shippingData: ShippingData[];
  methods: Array<{
    id: string;
    name: string;
    rate: number;
    currency: string;
    estimatedDelivery: string;
  }>;
  selectedMethod: string | null;
  shippingAddress: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2?: string;
  } | null;
  loading: boolean;
  error: string | null;
  localizedText: string;
}

const initialState: ShippingState = {
  shippingData: [],
  methods: [],
  selectedMethod: null,
  shippingAddress: null,
  loading: false,
  error: null,
  localizedText: '',
};


// Thunks
export const fetchShippingData = createAsyncThunk<
  ShippingData[], // Success type
  { country: string; currency: string }, // Argument type
  { rejectValue: string } // Rejected value type
>("shipping/fetchShippingData", async (params, thunkAPI) => {
  try {
    return await shippingService.fetchShippingData(params);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to fetch shipping data");
  }
});

export const updateShippingSettings = createAsyncThunk<
  { success: boolean },
  { id: string; updates: Record<string, any> }, // Argument type
  { rejectValue: string }
>("shipping/updateShippingSettings", async (settings, thunkAPI) => {
  try {
    return await shippingService.updateShippingSettings(settings);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to update shipping settings");
  }
});


// Async thunk for fetching shipping methods
export const fetchShippingMethods = createAsyncThunk(
  'shipping/fetchMethods',
  async (params: { country: string; currency: string }, thunkAPI) => {
    try {
      return await shippingService.getShippingMethods(params);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(getLocalizedText('fetchShippingError', 'returnAndRefund'));
    }
  }
);

// Shipping Slice
const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    setSelectedMethod(state, action: PayloadAction<string>) {
      state.selectedMethod = action.payload;
    },
    setShippingAddress(state, action: PayloadAction<ShippingState['shippingAddress']>) {
      state.shippingAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingData.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingData = action.payload;
      })
      .addCase(fetchShippingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred while fetching shipping data.";
      })
      .addCase(updateShippingSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingSettings.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateShippingSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred while updating shipping settings.";
      });
    builder
      .addCase(fetchShippingMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingMethods.fulfilled, (state, action) => {
        state.methods = action.payload;
        state.loading = false;
      })
      .addCase(fetchShippingMethods.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setSelectedMethod, setShippingAddress } = shippingSlice.actions;
export const selectShipping = (state: RootState) => state.shipping;
export default shippingSlice.reducer;
