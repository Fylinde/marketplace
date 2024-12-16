import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetch3DAsset, getTryOnData } from "../../../services/tryOnService";
import axios, { AxiosError } from "axios";

interface TryOnState {
  assets: Record<number, { url: string; fetchedAt: number }>; // Maps product IDs to asset data
  tryOnData: Record<string, any>; // Maps product IDs to their try-on data
  loading: boolean;
  error: string | null;
}


const CACHE_EXPIRATION_TIME = 1000 * 60 * 10; // Cache expires after 10 minutes

const initialState: TryOnState = {
  assets: {},
  tryOnData: {}, // Initialize tryOnData
  loading: false,
  error: null,
};



// Utility to extract error message from Axios or other error types
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Async thunk to fetch the 3D asset URL for a product
export const fetchAssetThunk = createAsyncThunk(
  "tryOn/fetchAsset",
  async (productId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { tryOn: TryOnState };

      // Check if asset is in the cache and still valid
      const cachedAsset = state.tryOn.assets[productId];
      if (cachedAsset && Date.now() - cachedAsset.fetchedAt < CACHE_EXPIRATION_TIME) {
        return { productId, assetUrl: cachedAsset.url, fromCache: true };
      }

      // Fetch new asset if not cached or expired
      const assetUrl = await fetch3DAsset(productId);
      return { productId, assetUrl, fromCache: false };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch 3D asset";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTryOnData = createAsyncThunk(
  "products/fetchTryOnData",
  async (productId: string, thunkAPI) => {
    try {
      const response = await getTryOnData(productId);
      return { productId, tryOnData: response.tryOnData }; // Access response.tryOnData
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);


const tryOnSlice = createSlice({
  name: "tryOn",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssetThunk.pending, (state: TryOnState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetThunk.fulfilled, (state: TryOnState, action) => {
        const { productId, assetUrl } = action.payload;
        state.assets[productId] = { url: assetUrl, fetchedAt: Date.now() };
        state.loading = false;
      })
      .addCase(fetchAssetThunk.rejected, (state: TryOnState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTryOnData.fulfilled, (state: TryOnState, action) => {
        const { productId, tryOnData } = action.payload;
        state.tryOnData[productId] = tryOnData; // Store try-on data by productId
      })
      .addCase(fetchTryOnData.rejected, (state: TryOnState, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default tryOnSlice.reducer;
