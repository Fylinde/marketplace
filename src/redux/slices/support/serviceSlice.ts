// src/redux/slices/serviceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceService from '../../../services/serviceService';
import { Service } from '../../../types/Service';

// Define the initial state for services
interface ServiceState {
  services: Service[];
  serviceDetails: Service | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  serviceDetails: null,
  loading: false,
  error: null,
};

// Fetch all services (e.g., HandyMan job listings)
export const fetchServices = createAsyncThunk('services/fetchServices', async (params: Record<string, any>, thunkAPI) => {
  try {
    return await serviceService.fetchServices(params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch a single service by ID
export const fetchServiceById = createAsyncThunk('services/fetchServiceById', async (serviceId: string, thunkAPI) => {
  try {
    return await serviceService.fetchServiceById(serviceId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice definition
const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching all services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle fetching a single service
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceDetails = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default serviceSlice.reducer;
