import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import shippingService from 'services/shippingService';
import { getLocalizedText } from '@/components/utils/localizationUtils';

// Define the types
interface ShippingState {
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
  methods: [],
  selectedMethod: null,
  shippingAddress: null,
  loading: false,
  error: null,
  localizedText: '',
};

// Async thunk for fetching shipping methods
export const fetchShippingMethods = createAsyncThunk(
  'shipping/fetchMethods',
  async (params: { country: string; currency: string }, thunkAPI) => {
    try {
      return await shippingService.getShippingMethods(params);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(getLocalizedText('fetchShippingError'));
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
