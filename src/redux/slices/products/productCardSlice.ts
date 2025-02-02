import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSocketService } from "../../../services/websocketService";
import axiosInstance from "../utils/axiosSetup";
import { Product } from "../../../types/Product";

const webSocketService = new WebSocketService('ws://mock-server', true);


interface ProductCardState {
  products: Product[]; // Product data
  recommendations: any[]; // Personalized recommendations
  communityQuestions: Record<string, any[]>; // Questions per product
  trendingStats: Record<string, { views: number; purchases: number }>; // Real-time trends
  localizedPrices: Record<
    string,
    {
      buyerPrice: number;
      buyerCurrency: string;
      sellerPrice: number;
      sellerCurrency: string;
    }
  >;
  hoverEffect: Record<string, boolean>; // Hover effects per product
  loading: boolean;
  error: string | null;
  stock: Record<string, number>; // Stock levels per product
  tryOnAvailable: Record<string, boolean>; // Visual TryOn availability
  priceHistory: Record<string, any[]>; // Price history per product
}
// Async Thunks
export const fetchProductDetails = createAsyncThunk(
  "productCard/fetchProductDetails",
  async ({ productId, buyerCurrency }: { productId: string; buyerCurrency: string }) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    const data = response.data;

    // Convert price using exchange rate
    const exchangeRateResponse = await axiosInstance.get(`/exchange-rate`, {
      params: { from: data.sellerCurrency, to: buyerCurrency },
    });

    return {
      ...data,
      localizedPrices: {
        buyerPrice: data.sellerPrice * exchangeRateResponse.data.rate,
        buyerCurrency,
        sellerPrice: data.sellerPrice,
        sellerCurrency: data.sellerCurrency,
      },
    };
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
  products: [],
  recommendations: [],
  communityQuestions: {},
  trendingStats: {},
  localizedPrices: {},
  hoverEffect: {},
  stock: {},
  tryOnAvailable: {},
  priceHistory: {},
  loading: false,
  error: null,
};

const productCardSlice = createSlice({
  name: "productCard",
  initialState,
  reducers: {
    setHoverEffect: (state, action) => {
      state.hoverEffect = action.payload;
    },
    updateLocalizedPrice: (state, action) => {
      state.localizedPrices = action.payload;
    },
    setTryOnAvailability: (state, action) => {
      const { productId, tryOnAvailable } = action.payload;
      state.tryOnAvailable[productId] = tryOnAvailable;
    },

    toggleHoverEffect: (state, action) => {
      const { productId, hoverEffect } = action.payload;
      if (state.products[productId]) {
        state.products[productId].hoverEffect = hoverEffect;
      }
    },
    updateStock: (state, action) => {
      const { productId, stock } = action.payload;
      state.stock[productId] = stock;
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
        state.products.push(product);
        state.localizedPrices[product.id] = product.localizedPrices;
        state.stock[product.id] = product.stock;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch product details.";
        state.loading = false;
      })
      .addCase(fetchPersonalizedRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalizedRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
        state.loading = false;
      })
      .addCase(fetchPersonalizedRecommendations.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch recommendations.";
        state.loading = false;
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
  setHoverEffect,
  toggleHoverEffect,
  updateStock,
  updateTrendingStats,
  setTryOnAvailability,
  updateDynamicPrice,
} = productCardSlice.actions;
export default productCardSlice.reducer;
