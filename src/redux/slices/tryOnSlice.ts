import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetch3DAsset } from "services/tryOnService";

interface TryOnState {
  assets: Record<number, { url: string; fetchedAt: number }>; // Maps product IDs to asset data with timestamp
  loading: boolean;
  error: string | null;
}

const CACHE_EXPIRATION_TIME = 1000 * 60 * 10; // Cache expires after 10 minutes

const initialState: TryOnState = {
  assets: {},
  loading: false,
  error: null,
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

const tryOnSlice = createSlice({
  name: "tryOn",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssetThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetThunk.fulfilled, (state, action) => {
        const { productId, assetUrl } = action.payload;
        state.assets[productId] = { url: assetUrl, fetchedAt: Date.now() };
        state.loading = false;
      })
      .addCase(fetchAssetThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tryOnSlice.reducer;
