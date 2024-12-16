import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSellerRating, addSellerRating as addSellerRatingService } from "services/sellerService";

// Define the rating type and seller state type
interface Rating {
  average: number;
  count: number;
  reviews: any[]; // Adjust `any` as per your review structure if available
}

interface SellerState {
  sellers: any[]; // Adjust `any` according to seller structure if available
  ratings: { [sellerId: string]: Rating };
  sellerId: string | null; // Currently selected or logged-in seller
  loading: boolean;
  error: string | null;
}

// Initial state with specified types
const initialState: SellerState = {
  sellers: [],
  ratings: {},
  sellerId: null, // No seller selected initially
  loading: false,
  error: null,
};

// Thunks for seller ratings
export const fetchSellerRating = createAsyncThunk(
  "sellers/fetchSellerRating",
  async (sellerId: string) => {
    const response = await getSellerRating(sellerId);
    return response.data;
  }
);

export const addSellerRating = createAsyncThunk(
  "sellers/addSellerRating",
  async ({ sellerId, ratingData }: { sellerId: string; ratingData: any }) => {
    const response = await addSellerRatingService(sellerId, ratingData);
    return response.data;
  }
);

// Seller slice with ratings and selected seller
const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {
    setSellerId(state, action) {
      state.sellerId = action.payload; // Update the selected sellerId
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerRating.fulfilled, (state, action) => {
        const sellerId = action.meta.arg; // sellerId comes from the action argument
        state.ratings[sellerId] = action.payload; // Store rating by sellerId
      })
      .addCase(addSellerRating.fulfilled, (state, action) => {
        const sellerId = action.meta.arg.sellerId;
        state.ratings[sellerId] = action.payload;
      });
  },
});

// Export the setSellerId action
export const { setSellerId } = sellerSlice.actions;

export default sellerSlice.reducer;
