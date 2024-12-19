// src/redux/slices/recommendationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import RecommendationService from "../../../services/RecommendationService";
import { Recommendation } from "@/types/Recommendation";


interface RecommendationState {
  recommendations: Recommendation[];
  personalized: any[];
  productBased: any[];
  searchBased: any[];
  aiPersonalized: any[]; // New property
  crossSelling: any[];   // New property
  upselling: any[];      // New property
  loading: boolean;
  error: string | null;
}


const initialState: RecommendationState = {
  recommendations: [],
  personalized: [],
  productBased: [],
  searchBased: [],
  aiPersonalized: [],
  crossSelling: [],
  upselling: [],
  loading: false,
  error: null,
};


// Thunks
export const fetchPersonalizedRecommendations = createAsyncThunk(
  "recommendation/fetchPersonalized",
  async (userId: string, thunkAPI) => {
    try {
      return await RecommendationService.getPersonalizedRecommendations(userId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch personalized recommendations.");
    }
  }
);

export const fetchProductRecommendations = createAsyncThunk(
  "recommendation/fetchProductBased",
  async (productId: string, thunkAPI) => {
    try {
      return await RecommendationService.getProductRecommendations(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch product recommendations.");
    }
  }
);

export const fetchSearchBasedRecommendations = createAsyncThunk(
  "recommendation/fetchSearchBased",
  async (query: string, thunkAPI) => {
    try {
      return await RecommendationService.getSearchBasedRecommendations(query);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch search-based recommendations.");
    }
  }
);

export const fetchAIPersonalizedRecommendations = createAsyncThunk(
  "recommendation/fetchAIPersonalized",
  async (userId: string, thunkAPI) => {
    try {
      return await RecommendationService.getAIPersonalizedRecommendations(userId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch AI-powered recommendations."
      );
    }
  }
);

export const fetchCrossSellingRecommendations = createAsyncThunk(
  "recommendation/fetchCrossSelling",
  async (productId: string, thunkAPI) => {
    try {
      return await RecommendationService.getCrossSellingRecommendations(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cross-selling recommendations."
      );
    }
  }
);

export const fetchUpsellingRecommendations = createAsyncThunk(
  "recommendation/fetchUpselling",
  async (productId: string, thunkAPI) => {
    try {
      return await RecommendationService.getUpsellingRecommendations(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch upselling recommendations."
      );
    }
  }
);

// Slice
const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalizedRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalizedRecommendations.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.personalized = action.payload;
      })
      .addCase(fetchPersonalizedRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProductRecommendations.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.productBased = action.payload;
      })
      .addCase(fetchSearchBasedRecommendations.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.searchBased = action.payload;
      });
  },
});

export default recommendationSlice.reducer;
