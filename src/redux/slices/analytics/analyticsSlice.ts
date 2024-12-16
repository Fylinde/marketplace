import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse, AxiosError } from "axios";
import api from "../utils/axiosSetup"; // Ensure this path is correct
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { getSegmentAnalytics } from "../../../services/analyticService";

// Define the structure of AnalyticsData
interface AnalyticsData {
  currencyBreakdown: { currency: string; percentage: number }[];
  totalFees: number;
  sellerCurrency: string;
}

// Define the shape of the Redux slice's state
interface AnalyticsState {
  chatbotResolved: number;
  humanResolved: number;

  // Overall analytics data
  analyticsData: AnalyticsData;

  loading: boolean;
  error: string | null;
  overallAnalytics: {
    totalRevenue: number;
    totalOrders: number;
    topCategories: string[];
  };
  segmentAnalytics: Record<"B2B" | "B2C" | "C2C", SegmentAnalytics>;
  salesTrends: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  flashDealConversion: {
    totalViews: number;
    totalPurchases: number;
  };
}

type SegmentAnalytics = {
  totalRevenue: number;
  totalOrders: number;
  topCategories: string[];
};
// Initial state of the slice
const initialState: AnalyticsState = {
  chatbotResolved: 0,
  humanResolved: 0,
  analyticsData: {
    currencyBreakdown: [],
    totalFees: 0,
    sellerCurrency: "",
  },
  loading: false,
  error: null,
  overallAnalytics: {
    totalRevenue: 0,
    totalOrders: 0,
    topCategories: [],
  },
  segmentAnalytics: {
    B2B: { totalRevenue: 0, totalOrders: 0, topCategories: [] },
    B2C: { totalRevenue: 0, totalOrders: 0, topCategories: [] },
    C2C: { totalRevenue: 0, totalOrders: 0, topCategories: [] },
  },
  salesTrends: {
    daily: [],
    weekly: [],
    monthly: [],
  },
  flashDealConversion: {
    totalViews: 0,
    totalPurchases: 0,
  },

};




export const fetchSegmentAnalytics = createAsyncThunk<
  Record<"B2B" | "B2C" | "C2C", SegmentAnalytics>,
  void,
  { rejectValue: string }
>("analytics/fetchSegmentAnalytics", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/analytics/segments");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response
        ? error.response.data.message
        : "Failed to fetch segment analytics";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


export const fetchSalesTrends = createAsyncThunk<
  { daily: number[]; weekly: number[]; monthly: number[] }, // Return type
  void, // Argument type (none)
  { rejectValue: string } // Rejected value type
>("analytics/fetchSalesTrends", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/analytics/sales-trends");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response
        ? error.response.data.message
        : "Failed to fetch sales trends";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const fetchFlashDealPerformance = createAsyncThunk<
  { totalViews: number; totalPurchases: number }, // Return type
  void, // Argument type (none)
  { rejectValue: string } // Rejected value type
>("analytics/fetchFlashDealPerformance", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/analytics/flash-deals");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response
        ? error.response.data.message
        : "Failed to fetch flash deal performance";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


// Async thunk to fetch currency analytics
export const fetchCurrencyAnalytics = createAsyncThunk<
  AnalyticsData, // Return type
  void, // Argument type (none in this case)
  { rejectValue: string } // Rejected value type
>(
  "analytics/fetchCurrencyAnalytics",
  async (_, thunkAPI) => {
    try {
      // Make the API request
      const response: AxiosResponse<AnalyticsData> = await api.get("/currency-analytics");
      return response.data; // Return the expected data structure
    } catch (error) {
      let errorMessage = "An unknown error occurred";

      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data || error.message;
      }

      // Reject with a meaningful error message
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const selectOverallAnalytics = (state: RootState) =>
  state.analytics.overallAnalytics;

export const selectSegmentAnalytics = (segment: "B2B" | "B2C" | "C2C") =>
  (state: RootState) => state.analytics.segmentAnalytics[segment];

export const selectSalesTrends = (state: RootState) =>
  state.analytics.salesTrends;


// Create the analytics slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    incrementChatbotResolved: (state) => {
      state.chatbotResolved += 1;
    },
    incrementHumanResolved: (state) => {
      state.humanResolved += 1;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchSegmentAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSegmentAnalytics.fulfilled, (state, action) => {
        state.loading = false;

        // Map lowercase keys from the payload to uppercase state keys
        const payload = action.payload as Record<string, SegmentAnalytics>;
        state.segmentAnalytics = {
          B2B: payload.b2b || { totalRevenue: 0, totalOrders: 0, topCategories: [] },
          B2C: payload.b2c || { totalRevenue: 0, totalOrders: 0, topCategories: [] },
          C2C: payload.c2c || { totalRevenue: 0, totalOrders: 0, topCategories: [] },
        };
      })
      .addCase(fetchSegmentAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch segment analytics";
      });






    // Sales trends
    builder
      .addCase(fetchSalesTrends.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSalesTrends.fulfilled, (state, action) => {
        state.salesTrends = action.payload;
      })
      .addCase(fetchSalesTrends.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch sales trends";
      });

    // Flash deal performance
    builder
      .addCase(fetchFlashDealPerformance.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFlashDealPerformance.fulfilled, (state, action) => {
        state.flashDealConversion = action.payload;
      })
      .addCase(fetchFlashDealPerformance.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch flash deal performance";
      });
    builder
      .addCase(fetchCurrencyAnalytics.fulfilled, (state, action) => {
        // Update analyticsData when the fetch succeeds
        state.analyticsData = action.payload;
      })
      .addCase(fetchCurrencyAnalytics.rejected, (state, action) => {
        console.error("Fetch failed:", action.payload); // Log the error for debugging
      })
      .addCase(fetchCurrencyAnalytics.pending, (state) => {
        console.log("Fetching currency analytics..."); // Optional: log pending state
      });
  },
});


// Export actions and reducer
export const { incrementChatbotResolved, incrementHumanResolved } = analyticsSlice.actions;
export default analyticsSlice.reducer;
