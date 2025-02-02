

import axios, { AxiosError } from "axios";
import { getBrands as fetchBrandsAPI } from "../../../services/brandService";
import { WritableDraft } from "immer";
import { Brand } from "../../../types/brand";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store"; // Ensure this path is correct


// Define Brand Interface


// Define BrandState
interface BrandState {
  brands: Brand[];
  currentBrand: Brand | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  loadingProducts?: boolean;
  loadingBrands?: boolean;
  products?: any[]; // Replace `any[]` with a more specific type if applicable
  selectedBrand?: string | null; // This is inferred from your code
  featuredBrands?: Brand[]; // Optional if used in fetchFeaturedBrands
}


const initialState: BrandState = {
  brands: [],
  currentBrand: null,
  loading: false,
  error: null,
  totalPages: 0,
  loadingProducts: false, // Add this
  loadingBrands: false,
  products: [], // Add this
  selectedBrand: null, // Add this
  featuredBrands: [], // Optional
};


// Utility to extract error messages
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Async Thunks
export const fetchBrands = createAsyncThunk<
  { brands: Brand[]; totalPages: number }, // Fulfilled payload type
  void, // Argument type
  { rejectValue: string } // Rejected value type
>(
  "products/fetchBrands",
  async (_, thunkAPI) => {
    try {
      const response = await fetchBrandsAPI(); // Axios call
      return {
        brands: response.data.brands,
        totalPages: response.data.totalPages,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);


export const fetchBrandDetails = createAsyncThunk(
  "brands/fetchBrandDetails",
  async (brandId: string, thunkAPI) => {
    try {
      const response = await axios.get(`/api/brands/${brandId}`);
      return response.data as Brand;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const addBrand = createAsyncThunk(
  "brands/addBrand",
  async (brandData: Omit<Brand, "id">, thunkAPI) => {
    try {
      const response = await axios.post(`/api/brands`, brandData);
      return response.data as Brand;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const editBrand = createAsyncThunk(
  "brands/editBrand",
  async ({ brandId, brandData }: { brandId: string; brandData: Partial<Brand> }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/brands/${brandId}`, brandData);
      return response.data as Brand;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (brandId: string, thunkAPI) => {
    try {
      await axios.delete(`/api/brands/${brandId}`);
      return brandId;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchFeaturedBrands = createAsyncThunk<
  Brand[],
  void,
  { rejectValue: string }
>("brands/fetchFeaturedBrands", async (_, thunkAPI) => {
  try {
    const response = await fetch(`/api/brands?featured=true`);
    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }
    const data = await response.json();

    if (data.brands.length === 0) {
      console.warn("Backend returned empty featured brands, falling back to mock data.");
      const { mockFeaturedBrands } = await import("../../../mock/data/mockFeaturedBrands");
      return mockFeaturedBrands;
    }

    return data.brands;
  } catch (error) {
    console.error("Error fetching Featured Brands:", error);
    const { mockFeaturedBrands } = await import("../../../mock/data/mockFeaturedBrands");
    return mockFeaturedBrands;
  }
});




// Slice
const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBrands = action.payload;
      })
      .addCase(fetchFeaturedBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch featured brands";
      });
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<{ brands: Brand[]; totalPages: number }>) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchBrandDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandDetails.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.loading = false;
        state.currentBrand = action.payload;
      })
      .addCase(fetchBrandDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.brands.push(action.payload);
      })

      .addCase(editBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        const index = state.brands.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })

      .addCase(deleteBrand.fulfilled, (state, action: PayloadAction<string>) => {
        state.brands = state.brands.filter((b) => b.id !== action.payload);
      })
  },
});



export const selectFeaturedBrands = (state: RootState) => ({
  featuredBrands: state.brands.featuredBrands,
  loading: state.brands.loading,
  error: state.brands.error,
});


export default brandSlice.reducer;
