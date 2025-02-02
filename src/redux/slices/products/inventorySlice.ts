import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryService from "../../../services/inventoryService";
import { RootState } from "../../store";

// Async Thunks
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      return await inventoryService.getInventory(sellerId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message); // Safely access error.message
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateInventory = createAsyncThunk(
  "inventory/updateInventory",
  async (inventoryData: { productId: string; updates: any }, { rejectWithValue }) => {
    try {
      return await inventoryService.updateInventory(inventoryData);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Slice
const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    inventory: [] as { id: string;[key: string]: any }[], // Explicitly type inventory items
    loading: false,
    error: null as string | null, // Type error as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Cast payload to string
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        state.inventory = state.inventory.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
      });
  },
});

// Selectors
export const selectInventory = (state: RootState) => state.inventory.inventory;
export const selectInventoryError = (state: RootState) => state.inventory.error;
export const selectInventoryLoading = (state: RootState) => state.inventory.loading;

export default inventorySlice.reducer;
