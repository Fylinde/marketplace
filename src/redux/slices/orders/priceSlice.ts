import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import priceService from '../../../services/priceService';

interface PriceRecommendation {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
}

interface PriceState {
  recommendations: PriceRecommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: PriceState = {
  recommendations: [],
  loading: false,
  error: null,
};

export const fetchPriceRecommendations = createAsyncThunk(
  'price/fetchPriceRecommendations',
  async (params: { sellerId: string; region: string }, thunkAPI) => {
    try {
      return await priceService.getPriceRecommendations(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceRecommendations.fulfilled, (state, action: PayloadAction<PriceRecommendation[]>) => {
        state.recommendations = action.payload;
        state.loading = false;
      })
      .addCase(fetchPriceRecommendations.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default priceSlice.reducer;
