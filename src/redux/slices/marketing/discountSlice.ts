import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import discountService from '../../../services/discountService';


interface DiscountRecommendation {
  productId: string;
  currentDiscount: number;
  suggestedDiscount: number;
  reason: string;
}

interface DiscountState {
  recommendations: DiscountRecommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: DiscountState = {
  recommendations: [],
  loading: false,
  error: null,
};

export const fetchDiscountRecommendations = createAsyncThunk(
  'discount/fetchDiscountRecommendations',
  async (params: { sellerId: string; season: string }, thunkAPI) => {
    try {
      return await discountService.getDiscountRecommendations(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscountRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscountRecommendations.fulfilled, (state, action: PayloadAction<DiscountRecommendation[]>) => {
        state.recommendations = action.payload;
        state.loading = false;
      })
      .addCase(fetchDiscountRecommendations.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default discountSlice.reducer;
