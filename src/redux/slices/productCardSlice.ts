import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSocketService } from "services/websocketService";
import axiosInstance from "./axiosSetup";
import { Product } from "@/types/Product";

const webSocketService = new WebSocketService("wss://your-websocket-url");


interface ProductCardState {
  products: Product[]; // Product data by ID
  recommendations: any[]; // Personalized recommendations
  communityQuestions: Record<string, any[]>; // Questions per product
  trendingStats: Record<string, { views: number; purchases: number }>; // Real-time trends
  localizedPrices: Record<string, { buyerPrice: number; sellerPrice: number }>; // Prices in buyer and seller currencies
  hoverEffect: Record<string, string>; // Hover effects per product
  loading: boolean;
  error: string | null;
  stock: number;
  tryOnAvailable: boolean;
  }
// Async Thunks
export const fetchProductDetails = createAsyncThunk(
  "productCard/fetchProductDetails",
  async (productId: string) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  }
);

export const fetchPersonalizedRecommendations = createAsyncThunk(
  "productCard/fetchPersonalizedRecommendations",
  async ({ buyerId, region }: { buyerId: string; region: string }) => {
    const response = await axiosInstance.get(`/recommendations`, { params: { buyerId, region } });
    return response.data;
  }
);

export const fetchPriceHistory = createAsyncThunk(
  "productCard/fetchPriceHistory",
  async (productId: string) => {
    const response = await axiosInstance.get(`/products/${productId}/price-history`);
    return response.data;
  }
);

export const fetchCommunityQuestions = createAsyncThunk(
  "productCard/fetchCommunityQuestions",
  async (productId: string) => {
    const response = await axiosInstance.get(`/products/${productId}/questions`);
    return response.data;
  }
);

// Initial State
const initialState: ProductCardState = {
  hoverEffect: {},
  stock: 0,
  localizedPrices: {},
  tryOnAvailable: false,
  products: [], // Store product data by ID
  recommendations: [], // Personalized recommendations
  communityQuestions: {}, // Questions per product
  trendingStats: {}, // Real-time trends
  loading: false,
  error: null,
};

const productCardSlice = createSlice({
  name: "productCard",
  initialState,
    reducers: {
    updatePriceDisplay: (state, action) => {
       const { productId, buyerPrice, sellerPrice } = action.payload;
       const product = state.products.find((p) => p.id === productId);
       if (product) {
        product.buyerPrice = buyerPrice;
        product.sellerPrice = sellerPrice;
      }
    },      
    setHoverEffect: (state, action) => {
      state.hoverEffect = action.payload;
    },
    updateLocalizedPrice: (state, action) => {
      state.localizedPrices = action.payload;
    },
    setTryOnAvailability: (state, action) => {
      state.tryOnAvailable = action.payload;
    },
      
    toggleHoverEffect: (state, action) => {
      const { productId, hoverEffect } = action.payload;
      if (state.products[productId]) {
        state.products[productId].hoverEffect = hoverEffect;
      }
    },
    updateStock: (state, action) => {
      const { productId, stock } = action.payload;
      if (state.products[productId]) {
        state.products[productId].stock = stock;
      }
    },
    updateTrendingStats: (state, action) => {
      const { productId, views, purchases } = action.payload;
      state.trendingStats[productId] = { views, purchases };
    },
    updateDynamicPrice: (state, action) => {
      const { productId, price, saleEndsIn } = action.payload;
      if (state.products[productId]) {
        state.products[productId].dynamicPrice = { price, saleEndsIn };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        const product = action.payload;
        state.products[product.id] = product;
        state.loading = false;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch product details.";
        state.loading = false;
      })
      .addCase(fetchPersonalizedRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchPriceHistory.fulfilled, (state, action) => {
        const { productId, history } = action.payload;
        if (state.products[productId]) {
          state.products[productId].priceHistory = history;
        }
      })
      .addCase(fetchCommunityQuestions.fulfilled, (state, action) => {
        const { productId, questions } = action.payload;
        state.communityQuestions[productId] = questions;
      });
  },
});

// Export Actions and Reducer
export const {
  toggleHoverEffect,
  updateStock,
  updateTrendingStats,
  updateDynamicPrice,
} = productCardSlice.actions;
export default productCardSlice.reducer;
