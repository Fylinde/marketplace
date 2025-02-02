import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import c2cService from "../../../services/c2cService";
import { RootState } from "../../store";

// Async Thunks
export const fetchC2CListings = createAsyncThunk(
  "c2c/fetchListings",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      return await c2cService.getC2CListings(sellerId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateC2CListing = createAsyncThunk(
  "c2c/updateListing",
  async (listingData: { listingId: string; updates: any }, { rejectWithValue }) => {
    try {
      return await c2cService.updateC2CListing(listingData);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Slice
const c2cSlice = createSlice({
  name: "c2c",
  initialState: {
    listings: [] as { id: string;[key: string]: any }[], // Type includes `id`
    loading: false,
    error: null as string | null, // Explicitly type error
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchC2CListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchC2CListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchC2CListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateC2CListing.fulfilled, (state, action) => {
        const updatedListing = action.payload;
        state.listings = state.listings.map((item) =>
          item.id === updatedListing.id ? updatedListing : item
        );
      });
  },
});

// Selectors
export const selectC2CListings = (state: RootState) => state.c2c.listings;
export const selectC2CError = (state: RootState) => state.c2c.error;
export const selectC2CLoading = (state: RootState) => state.c2c.loading;

export default c2cSlice.reducer;
