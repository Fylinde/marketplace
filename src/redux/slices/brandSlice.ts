import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Define Brand Interface
interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  establishedYear?: number;
  countryOfOrigin?: string;
  website?: string;
  tags?: string[];
  popularityScore?: number;
  productCount?: number;
}

// Define BrandState
interface BrandState {
  brands: Brand[];
  currentBrand: Brand | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: BrandState = {
  brands: [],
  currentBrand: null,
  loading: false,
  error: null,
  totalPages: 0,
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
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (page: number = 1, thunkAPI) => {
    try {
      const response = await axios.get(`/api/brands`, { params: { page } });
      return response.data; // Assuming API returns { brands: Brand[], totalPages: number }
    } catch (error) {
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

// Slice
const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
      });
  },
});

export default brandSlice.reducer;
