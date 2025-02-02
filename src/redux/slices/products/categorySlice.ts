// src/redux/slices/categorySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import categoryService from '../../../services/categoryService';
import { Category } from '../../../types/category';

// Define the state for categories
interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  loadingProducts: boolean;
  loadingCategories: boolean;
  error: string | null;
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  loadingProducts: false,
  loadingCategories: false,
  error: null,
};

// Utility function to extract error messages
const extractErrorMessage = (error: any): string =>
  error?.response?.data?.message || error.message || 'An error occurred';



// Async thunk to fetch all categories
// Async thunk to fetch all categories
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/fetchCategories", async (_, thunkAPI) => {
  try {
    // Try fetching categories from the backend
    const response = await fetch(`/api/categories`);
    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }
    const data = await response.json();

    // Fallback to mock data if the backend returns an empty array
    if (data.categories.length === 0) {
      console.warn("Backend returned empty categories, falling back to mock data.");
      const { mockCategories } = await import("../../../mock/data/categories");
      return mockCategories;
    }

    return data.categories;
  } catch (error) {
    console.error("Error fetching categories from backend:", error);

    // Fallback to mock data in case of errors
    const { mockCategories } = await import("../../../mock/data/categories");
    return mockCategories;
  }
});

// Async thunk to fetch a single category by ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchById',
  async (categoryId: string, thunkAPI) => {
    try {
      return await categoryService.fetchCategoryById(categoryId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Create category slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.error = action.payload || "Failed to load categories";
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectCategories = (state: RootState) => ({
  categories: state.categories.categories,
  loading: state.categories.loadingCategories,
  error: state.categories.error,
});
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;
export const selectCategoryError = (state: RootState) => state.categories.error;

// Export actions and reducer
export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
