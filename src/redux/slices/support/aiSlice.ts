import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import aiService from '../../../services/aiService';
import priceService from '../../../services/priceService';
import discountService from '../../../services/discountService';
import marketingService from '../../../services/marketingService';
import { Recommendation } from '../../../types/Recommendation';


  

interface StockInsight {
  productId: string;
  recommendedStock: number;
  demandForecast: string;
}

interface AIState {
  recommendations: Recommendation[];
  stockInsights: StockInsight[];
  chatbotResponse: string | null;
  tryOnData: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  recommendations: [],
  stockInsights: [],
  chatbotResponse: null,
  tryOnData: null,
  loading: false,
  error: null,
};

export const fetchRecommendations = createAsyncThunk(
    'ai/fetchRecommendations',
    async (
      params: {
        type: string;
        sellerId?: string;
        buyerId?: string;
        region?: string;
        season?: string;
        targetAudience?: string;
        language?: string; // Added language
        currency?: string; // Added currency
      },
      thunkAPI
    ) => {
      try {
        switch (params.type) {
          case 'price':
            return await aiService.getPriceRecommendations({
              sellerId: params.sellerId!,
              region: params.region || 'default-region',
            });
  
          case 'discount':
            return await aiService.getDiscountRecommendations({
              sellerId: params.sellerId!,
              season: params.season || 'default-season',
            });
  
          case 'marketing':
            return await aiService.getMarketingStrategies({
              sellerId: params.sellerId!,
              targetAudience: params.targetAudience || 'default-audience',
            });
  
          case 'buyer-focused':
            return await aiService.getBuyerRecommendations({
              buyerId: params.buyerId!,
              language: params.language || 'en', // Default language
              currency: params.currency || 'USD', // Default currency
            });
  
          default:
            throw new Error('Invalid recommendation type');
        }
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message);
      }
    }
  );
  
  
  
  
// Fetch stock insights
export const fetchStockInsights = createAsyncThunk(
  'ai/fetchStockInsights',
  async (params: { sellerId: string; language: string; currency: string }, thunkAPI) => {
    try {
      return await aiService.getStockInsights(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Process chatbot query
export const fetchChatbotResponse = createAsyncThunk(
  'ai/fetchChatbotResponse',
  async (params: { query: string; language: string; userId?: string }, thunkAPI) => {
    try {
      return await aiService.queryChatbot(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch Try-On data
export const fetchTryOnData = createAsyncThunk(
  'ai/fetchTryOnData',
  async (productId: string, thunkAPI) => {
    try {
      return await aiService.getTryOnData(productId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action: PayloadAction<Recommendation[]>) => {
        state.recommendations = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecommendations.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockInsights.fulfilled, (state, action: PayloadAction<StockInsight[]>) => {
        state.stockInsights = action.payload;
      })
      .addCase(fetchChatbotResponse.fulfilled, (state, action: PayloadAction<string>) => {
        state.chatbotResponse = action.payload;
      })
      .addCase(fetchTryOnData.fulfilled, (state, action: PayloadAction<any>) => {
        state.tryOnData = action.payload;
      });
  },
});

export default aiSlice.reducer;
