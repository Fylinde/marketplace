// slices/bannerSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bannerService from "services/bannerService"; // Service for API calls
import { Banner } from "@/types/banner";

// Async Thunk to fetch banners
export const fetchBanners = createAsyncThunk(
  "banner/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bannerService.getBanners();
      // Assuming response is an array of banners
      return response as Banner[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch banners");
    }
  }
);

// Initial State
const initialState = {
  banners: [] as Banner[], // Initialize as an empty array
  loading: false,
  error: null as string | null, // Define error as string | null
};

// Slice
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners = action.payload; // Assign payload to banners
        state.loading = false;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.error = action.payload as string; // Cast payload to string
        state.loading = false;
      });
  },
});

// Export the reducer
export default bannerSlice.reducer;
