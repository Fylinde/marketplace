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
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await categoryService.fetchCategories();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
export const selectCategories = (state: RootState) => state.categories; // Return the entire state slice
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;
export const selectCategoryError = (state: RootState) => state.categories.error;

// Export actions and reducer
export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
