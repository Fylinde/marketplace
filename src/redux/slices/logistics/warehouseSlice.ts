import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import warehouseService from '../../../services/warehouseService';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  stock: Array<{ productId: string; quantity: number }>;
}

interface Recommendation {
  productId: string;
  warehouseId: string;
  suggestedStock: number;
}

interface WarehouseState {
  warehouses: Warehouse[];
  sharedInventory: any[];
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: WarehouseState = {
  warehouses: [],
  sharedInventory: [],
  recommendations: [],
  loading: false,
  error: null,
};

// Async thunk to fetch warehouses
export const fetchWarehouses = createAsyncThunk(
  'warehouse/fetchWarehouses',
  async (_, thunkAPI) => {
    try {
      return await warehouseService.getWarehouses();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Async thunk to fetch stock recommendations
export const fetchRecommendations = createAsyncThunk(
  'warehouse/fetchRecommendations',
  async (_, thunkAPI) => {
    try {
      return await warehouseService.getStockRecommendations();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Async thunk to fetch shared inventory agreements
export const fetchSharedInventory = createAsyncThunk(
  'warehouse/fetchSharedInventory',
  async (_, thunkAPI) => {
    try {
      return await warehouseService.getSharedInventory();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action: PayloadAction<Warehouse[]>) => {
        state.warehouses = action.payload;
        state.loading = false;
      })
      .addCase(fetchWarehouses.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action: PayloadAction<Recommendation[]>) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchSharedInventory.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.sharedInventory = action.payload;
      });
  },
});

export default warehouseSlice.reducer;
