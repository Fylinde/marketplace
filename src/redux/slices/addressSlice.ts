// src/redux/slices/addressSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from '../../models/Address'; // Make sure 'id' is part of Address interface
import { getUserAddresses } from 'services/addressService';

// Define the slice's initial state
interface AddressState {
  addresses: Address[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  status: 'idle',
  error: null,
};

export const fetchUserAddresses = createAsyncThunk(
  'addresses/fetchUserAddresses',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getUserAddresses(userId);
      return response; // Assuming response is an array of Address[]
    } catch (err) {
      return rejectWithValue((err as any).response.data);
    }
  }
);


// Slice definition
const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.addresses.push(action.payload);
    },
    deleteAddress(state, action: PayloadAction<number>) {
      // Here we use 'id' to filter out the deleted address
      state.addresses = state.addresses.filter(address => address.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAddresses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
        state.addresses = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { addAddress, deleteAddress } = addressSlice.actions;
export default addressSlice.reducer;
