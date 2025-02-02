import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    fetchShops,
    fetchShopById,
    createShop,
    updateShop,
    deleteShop,
    fetchAIRecommendations,
} from "../../../services/shopService";
import { Shop } from "@/types/shop";

interface ShopState {
  shops: Shop[];
  currentShop: Shop | null;
  aiRecommendations: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  shops: [],
  currentShop: null,
  aiRecommendations: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchShopsThunk = createAsyncThunk("shop/fetchShops", async (_, { rejectWithValue }) => {
  try {
    return await fetchShops();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchShopByIdThunk = createAsyncThunk("shop/fetchShopById", async (shopId: string, { rejectWithValue }) => {
  try {
    return await fetchShopById(shopId);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createShopThunk = createAsyncThunk("shop/createShop", async (shopData: { name: string; description: string; logo?: File }, { rejectWithValue }) => {
  try {
    return await createShop(shopData);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteShopThunk = createAsyncThunk("shop/deleteShop", async (shopId: string, { rejectWithValue }) => {
  try {
    await deleteShop(shopId);
    return shopId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchAIRecommendationsThunk = createAsyncThunk("shop/fetchAIRecommendations", async (shopId: string, { rejectWithValue }) => {
  try {
    return await fetchAIRecommendations(shopId);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Slice
const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopsThunk.fulfilled, (state, action: PayloadAction<Shop[]>) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(fetchShopsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchShopByIdThunk.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.currentShop = action.payload;
      })

      .addCase(createShopThunk.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.shops.push(action.payload);
      })

      .addCase(deleteShopThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.shops = state.shops.filter((shop) => shop.id !== action.payload);
      })

      .addCase(fetchAIRecommendationsThunk.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.aiRecommendations = action.payload;
      });
  },
});

export default shopSlice.reducer;
