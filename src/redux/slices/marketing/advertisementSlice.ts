import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAdvertisementsAPI } from "../../../services/advertisementService";
import { Product } from "../../../types/Product";

interface AdvertisementState {
  advertisements: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: AdvertisementState = {
  advertisements: [],
  loading: false,
  error: null,
};

// Async action to fetch advertisements
export const fetchAdvertisements = createAsyncThunk(
    "advertisements/fetchAdvertisements",
    async () => {
      const response = await fetch("/api/advertisements");
      if (!response.ok) throw new Error("Failed to fetch advertisements");
      return (await response.json()) as Product[];
    }
  );

// Advertisement slice
const advertisementSlice = createSlice({
  name: "advertisements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvertisements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvertisements.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.advertisements = action.payload;
      })
      .addCase(fetchAdvertisements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default advertisementSlice.reducer;
