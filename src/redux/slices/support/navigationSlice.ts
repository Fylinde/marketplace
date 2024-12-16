import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import navigationService from "../../../services/navigationService"; // Service for fetching navigation items

interface NavigationItem {
  title: string;
  icon: string;
  href: string;
}

interface NavigationState {
  navigationItems: NavigationItem[];
  loading: boolean;
  error: string | null;
}

interface NavigationServiceResponse {
    data: NavigationItem[];
}

  
  const initialState: NavigationState = {
    navigationItems: [],
    loading: false,
    error: null,
  };
  
  // Async Thunk for fetching navigation items
  export const fetchNavigationItems = createAsyncThunk(
    "navigation/fetchNavigationItems",
    async (_, thunkAPI) => {
      try {
        const response = (await navigationService.getNavigationItems()) as NavigationServiceResponse;
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message || "Failed to fetch navigation items");
      }
    }
  );
  
  // Navigation Slice
  const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchNavigationItems.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchNavigationItems.fulfilled, (state, action) => {
          state.loading = false;
          state.navigationItems = action.payload;
        })
        .addCase(fetchNavigationItems.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export default navigationSlice.reducer;