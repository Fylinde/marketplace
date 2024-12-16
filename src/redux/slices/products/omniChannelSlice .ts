import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import omniChannelService from '../../../services/omniChannelService ';
import { Product } from '../../../types/Product';
import { InventoryItem } from '@/types/sharedTypes';
import { Order } from '../../../types/order';



interface OmniChannelState {
  products: Product[];
  inventory: InventoryItem[];
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OmniChannelState = {
  products: [],
  inventory: [],
  orders: [],
  loading: false,
  error: null,
};

// Fetch products
export const fetchProducts = createAsyncThunk(
  'omniChannel/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await omniChannelService.getProducts();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch inventory
export const fetchInventory = createAsyncThunk(
  'omniChannel/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      return await omniChannelService.getInventory();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch orders
export const fetchOrders = createAsyncThunk(
  'omniChannel/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await omniChannelService.getOrders();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Sync inventory
export const syncInventory = createAsyncThunk(
  'omniChannel/syncInventory',
  async (payload: any, { rejectWithValue }) => {
    try {
      return await omniChannelService.syncInventory(payload);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const omniChannelSlice = createSlice({
  name: 'omniChannel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.products = payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      })
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, { payload }) => {
        state.inventory = payload;
        state.loading = false;
      })
      .addCase(fetchInventory.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.orders = payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      })
      .addCase(syncInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncInventory.fulfilled, (state, { payload }) => {
        state.inventory = state.inventory.map((item) =>
          item.id === payload.id ? payload : item
        );
        state.loading = false;
      })
      .addCase(syncInventory.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      });
  },
});

export default omniChannelSlice.reducer;
