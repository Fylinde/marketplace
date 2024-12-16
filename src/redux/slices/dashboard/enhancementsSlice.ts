import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Coupon } from "../../../types/coupon";
import enhancementsService from "../../../services/enhancementsService";
import { RootState } from "../../store"; // Ensure correct path to store
import packagingService, { PackagingGuideline } from "../../../services/packagingService";

interface EnhancementsState {
  coupons: Coupon[];
  guidelines: PackagingGuideline[];
  loading: boolean;
  error: string | null;
}

const initialState: EnhancementsState = {
  coupons: [],
  guidelines: [],
  loading: false,
  error: null,
};


// Fetch all packaging guidelines
export const fetchPackagingGuidelines = createAsyncThunk<
  PackagingGuideline[], // Explicit return type
  void,
  { rejectValue: string }
>("enhancements/fetchPackagingGuidelines", async (_, thunkAPI) => {
  try {
    return await packagingService.fetchPackagingGuidelines();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch packaging guidelines");
  }
});

// Create a new guideline
export const createGuideline = createAsyncThunk<
  PackagingGuideline, // Explicit return type
  Partial<PackagingGuideline>, // Input type
  { rejectValue: string }
>("enhancements/createGuideline", async (guideline, thunkAPI) => {
  try {
    return await packagingService.createGuideline(guideline);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to create guideline");
  }
});

// Update a guideline
export const updateGuideline = createAsyncThunk<
  PackagingGuideline, // Explicit return type
  { id: string; updates: Partial<PackagingGuideline> }, // Input type
  { rejectValue: string }
>("enhancements/updateGuideline", async ({ id, updates }, thunkAPI) => {
  try {
    return await packagingService.updateGuideline(id, updates);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to update guideline");
  }
});

// Delete a guideline
export const deleteGuideline = createAsyncThunk<
  { id: string }, // Explicit return type
  string, // Input type
  { rejectValue: string }
>("enhancements/deleteGuideline", async (id, thunkAPI) => {
  try {
    await packagingService.deleteGuideline(id);
    return { id }; // Return only the ID to remove it from state
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to delete guideline");
  }
});

export const fetchCoupons = createAsyncThunk<Coupon[]>(
  "enhancements/fetchCoupons",
  async () => {
    const response = await enhancementsService.getCoupons();
    return response;
  }
);

export const createCoupon = createAsyncThunk<Coupon, Partial<Coupon>>(
  "enhancements/createCoupon",
  async (couponData) => {
    const response = await enhancementsService.createCoupon(couponData);
    return response;
  }
);

export const deleteCoupon = createAsyncThunk<string, string>(
  "enhancements/deleteCoupon",
  async (couponId) => {
    await enhancementsService.deleteCoupon(couponId);
    return couponId;
  }
);

const enhancementsSlice = createSlice({
  name: "enhancements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      // Fetch Guidelines
      .addCase(fetchPackagingGuidelines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackagingGuidelines.fulfilled, (state, action: PayloadAction<PackagingGuideline[]>) => {
        state.loading = false;
        state.guidelines = action.payload;
      })
      .addCase(fetchPackagingGuidelines.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch guidelines";
      })

      // Create Guideline
      .addCase(createGuideline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuideline.fulfilled, (state, action: PayloadAction<PackagingGuideline>) => {
        state.loading = false;
        state.guidelines.push(action.payload);
      })
      .addCase(createGuideline.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to create guideline";
      })

      // Update Guideline
      .addCase(updateGuideline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGuideline.fulfilled, (state, action: PayloadAction<PackagingGuideline>) => {
        state.loading = false;
        const index = state.guidelines.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.guidelines[index] = action.payload;
        }
      })
      .addCase(updateGuideline.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to update guideline";
      })

      // Delete Guideline
      .addCase(deleteGuideline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGuideline.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.guidelines = state.guidelines.filter((g) => g.id !== action.payload.id);
      })
      .addCase(deleteGuideline.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete guideline";
      });
    builder
      .addCase(fetchCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
        state.coupons = action.payload;
      })
      .addCase(createCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
        state.coupons.push(action.payload);
      })
      .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<string>) => {
        state.coupons = state.coupons.filter((coupon) => coupon.id !== action.payload);
      });
  },
});

export const selectCoupons = (state: RootState) => state.enhancements.coupons;
export default enhancementsSlice.reducer;
