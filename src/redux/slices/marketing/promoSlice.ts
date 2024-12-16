import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import promoService from "../../../services/promoService";

interface PromoState {
  promoCode: string | null;
  discount: number;
  loading: boolean;
  error: string | null;
}

const initialState: PromoState = {
  promoCode: null,
  discount: 0,
  loading: false,
  error: null,
};

// Async Thunks
export const applyPromoCode = createAsyncThunk<
  { discount: number; code: string },
  string,
  { rejectValue: string }
>("promo/applyPromoCode", async (code, thunkAPI) => {
  try {
    const response = await promoService.validatePromoCode(code);
    return { discount: response.discount, code };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Invalid promo code.");
  }
});

const promoSlice = createSlice({
  name: "promoCode",
  initialState,
  reducers: {
    applyPromoCodeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    applyPromoCodeSuccess: (state, action: PayloadAction<{ promoCode: string; discount: number }>) => {
      state.loading = false;
      state.promoCode = action.payload.promoCode;
      state.discount = action.payload.discount;
    },
    applyPromoCodeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearPromoCode(state) {
      state.promoCode = null;
      state.discount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyPromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyPromoCode.fulfilled, (state, action: PayloadAction<{ discount: number; code: string }>) => {
        state.promoCode = action.payload.code;
        state.discount = action.payload.discount;
        state.loading = false;
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to apply promo code.";
      });
  },
});

export const { applyPromoCodeStart, applyPromoCodeSuccess, applyPromoCodeFailure, clearPromoCode } = promoSlice.actions;

export default promoSlice.reducer;
