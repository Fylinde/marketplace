import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVendorRating, addVendorRating as addVendorRatingService } from "services/vendorService";

// Define the rating type and vendor state type
interface Rating {
  average: number;
  count: number;
  reviews: any[]; // Adjust `any` as per your review structure if available
}

interface VendorState {
  vendors: any[]; // Adjust `any` according to vendor structure if available
  ratings: { [vendorId: string]: Rating };
  loading: boolean;
  error: string | null;
}

// Initial state with specified types
const initialState: VendorState = {
  vendors: [],
  ratings: {},
  loading: false,
  error: null,
};

// Thunks for vendor ratings
export const fetchVendorRating = createAsyncThunk("vendors/fetchVendorRating", async (vendorId: string) => {
  const response = await getVendorRating(vendorId);
  return response.data;
});

// Define and export the addVendorRating thunk
export const addVendorRating = createAsyncThunk(
  "vendors/addVendorRating",
  async ({ vendorId, ratingData }: { vendorId: string; ratingData: any }) => {
    const response = await addVendorRatingService(vendorId, ratingData);
    return response.data;
  }
);

// Vendor slice with ratings
const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorRating.fulfilled, (state, action) => {
        const vendorId = action.meta.arg; // vendorId comes from the action argument
        state.ratings[vendorId] = action.payload; // Store rating by vendorId
      })
      .addCase(addVendorRating.fulfilled, (state, action) => {
        const vendorId = action.meta.arg.vendorId;
        state.ratings[vendorId] = action.payload;
      });
  },
});

export default vendorSlice.reducer;
