// src/redux/slices/featureSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import featureService from "../../../services/featureService";

// Define a Feature interface
interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

// Define the Redux state
interface FeatureState {
  features: Feature[];
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  features: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all features
export const fetchFeatures = createAsyncThunk("features/fetchFeatures", async (_, thunkAPI) => {
  try {
    return await featureService.fetchFeatures();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch features");
  }
});

const featureSlice = createSlice({
  name: "features",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default featureSlice.reducer;
