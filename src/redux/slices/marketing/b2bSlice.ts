import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import b2bService from "../../../services/b2bService";
import { RootState } from "../../store";

// Define the structure of B2B pricing items
interface B2BPricing {
  id: string;
  price: number;
  productName: string;
  category: string;
}

// Define the state structure for B2B slice
interface B2BState {
  pricing: B2BPricing[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: B2BState = {
  pricing: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchB2BPricing = createAsyncThunk(
  "b2b/fetchPricing",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      return await b2bService.getB2BPricing(sellerId);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch B2B pricing.");
    }
  }
);

export const updateB2BPricing = createAsyncThunk(
  "b2b/updatePricing",
  async (
    { sellerId, pricing }: { sellerId: string; pricing: B2BPricing[] },
    { rejectWithValue }
  ) => {
    try {
      return await b2bService.updateB2BPricing({ sellerId, pricing });
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update B2B pricing.");
    }
  }
);

// Slice
const b2bSlice = createSlice({
  name: "b2b",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchB2BPricing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchB2BPricing.fulfilled, (state, action) => {
        state.loading = false;
        state.pricing = action.payload;
      })
      .addCase(fetchB2BPricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateB2BPricing.fulfilled, (state, action) => {
        const updatedPricing = action.payload;
        state.pricing = state.pricing.map((item) =>
          updatedPricing.find((update: B2BPricing) => update.id === item.id) || item
        );
      });
  },
});

export const selectB2BPricing = (state: RootState) => state.b2b.pricing;
export const selectB2BLoading = (state: RootState) => state.b2b.loading;
export const selectB2BError = (state: RootState) => state.b2b.error;

export default b2bSlice.reducer;
