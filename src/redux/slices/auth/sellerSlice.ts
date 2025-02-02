import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSellerRating,
  addSellerRating as addSellerRatingService,
  getSellerDetails,
  updateSellerDetails,
  getExchangeRates,
  startLiveSession,
} from "../../../services/sellerService";

// Define types for ratings, pricing, and seller state
interface Rating {
  average: number;
  count: number;
  reviews: any[]; // Adjust `any` as per your review structure
}

interface Pricing {
  sellerCurrency: string | null;
  exchangeRates: { [currency: string]: number };
}

interface LiveShopping {
  isLive: boolean;
  liveSessions: any[]; // Replace `any` with your session structure
}

interface SellerState {
  sellers: any[]; // Replace `any` with the seller structure
  sellerDetails: any | null; // Replace `any` with your seller details structure
  ratings: { [sellerId: string]: Rating };
  sellerId: string | null; // Currently selected or logged-in seller
  pricing: Pricing;
  liveShopping: LiveShopping;
  loading: boolean;
  error: string | null;
}

// Initial state with types
const initialState: SellerState = {
  sellers: [],
  sellerDetails: null,
  ratings: {},
  sellerId: null,
  pricing: {
    sellerCurrency: null,
    exchangeRates: {},
  },
  liveShopping: {
    isLive: false,
    liveSessions: [],
  },
  loading: false,
  error: null,
};

// Thunks for ratings
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

// Thunks for seller details
export const fetchSellerDetails = createAsyncThunk(
  "sellers/fetchSellerDetails",
  async () => {
    const response = await getSellerDetails();
    return response.data;
  }
);

export const updateSeller = createAsyncThunk(
  "sellers/updateSeller",
  async (data: any) => {
    const response = await updateSellerDetails(data);
    return response.data;
  }
);

// Thunks for currency exchange
export const fetchExchangeRates = createAsyncThunk(
  "sellers/fetchExchangeRates",
  async () => {
    const response = await getExchangeRates();
    return response.data;
  }
);

// Thunks for live shopping
export const startLiveShoppingSession = createAsyncThunk(
  "sellers/startLiveShoppingSession",
  async (sessionDetails: any) => {
    const response = await startLiveSession(sessionDetails);
    return response.data;
  }
);

// Unified Seller Slice
const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {
    setSellerId(state, action) {
      state.sellerId = action.payload;
    },
    setSellerCurrency(state, action) {
      state.pricing.sellerCurrency = action.payload;
    },
    setLiveShopping(state, action) {
      state.liveShopping = {
        isLive: action.payload.isLive,
        liveSessions: action.payload.liveSessions,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Ratings

      .addCase(addSellerRating.fulfilled, (state, action) => {
        const sellerId = action.meta.arg.sellerId;
        state.ratings[sellerId] = action.payload;
      })
      // Seller Details
      .addCase(fetchSellerDetails.fulfilled, (state, action) => {
        state.sellerDetails = action.payload;
      })
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.sellerDetails = { ...state.sellerDetails, ...action.payload };
      })
      // Currency Exchange
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.pricing.exchangeRates = action.payload;
      })
      // Live Shopping
      .addCase(startLiveShoppingSession.fulfilled, (state, action) => {
        state.liveShopping.liveSessions.push(action.payload);
        state.liveShopping.isLive = true;
      })
      // Loading States
      .addCase(fetchSellerRating.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerRating.fulfilled, (state, action) => {
        const sellerId = action.meta.arg;
        state.ratings[sellerId] = action.payload;
      })
      .addCase(fetchSellerRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch seller rating.";
      });
  },
});

// Export actions
export const { setSellerId, setSellerCurrency, setLiveShopping } = sellerSlice.actions;

// Export the reducer
export default sellerSlice.reducer;
