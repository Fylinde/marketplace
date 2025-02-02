import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Address {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean; // Whether the address is the default
}

interface AddressState {
  addresses: Address[]; // List of all saved addresses
  defaultAddress: Address | null; // Default address for quick selection
  loading: boolean; // Loading state for async operations
  error: string | null; // Error messages for failed operations
}

const initialState: AddressState = {
  addresses: [],
  defaultAddress: null,
  loading: false,
  error: null,
};

// Async Thunks for API interactions

// Fetch all saved addresses
export const loadAddresses = createAsyncThunk("address/loadAddresses", async () => {
  const response = await axios.get("/api/addresses"); // Replace with your API endpoint
  return response.data;
});

// Add a new address
export const saveAddress = createAsyncThunk(
  "address/saveAddress",
  async (address: Address) => {
    const response = await axios.post("/api/addresses", address);
    return response.data;
  }
);

// Update an existing address
export const modifyAddress = createAsyncThunk(
  "address/modifyAddress",
  async ({ id, address }: { id: string; address: Address }) => {
    const response = await axios.put(`/api/addresses/${id}`, address);
    return response.data;
  }
);

// Delete an address
export const deleteAddress = createAsyncThunk("address/deleteAddress", async (id: string) => {
  await axios.delete(`/api/addresses/${id}`);
  return id;
});

// Address slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // Set default address
    setDefaultAddress(state, action: PayloadAction<string>) {
      const defaultAddress = state.addresses.find((address) => address.id === action.payload);
      if (defaultAddress) {
        state.defaultAddress = defaultAddress;

        // Update isDefault for all addresses
        state.addresses.forEach((address) => {
          address.isDefault = address.id === action.payload;
        });
      }
    },
    // Clear all addresses (e.g., for user logout)
    clearAddresses(state) {
      state.addresses = [];
      state.defaultAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
        state.addresses = action.payload;

        // Automatically set the first address as default if none is marked
        state.defaultAddress = action.payload.find((address) => address.isDefault) || action.payload[0] || null;

        state.loading = false;
      })
      .addCase(loadAddresses.rejected, (state, action) => {
        state.error = action.error.message || "Failed to load addresses.";
        state.loading = false;
      })
      .addCase(saveAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.addresses.push(action.payload);
        if (action.payload.isDefault) {
          state.defaultAddress = action.payload;

          // Update isDefault for other addresses
          state.addresses.forEach((address) => {
            if (address.id !== action.payload.id) {
              address.isDefault = false;
            }
          });
        }
      })
      .addCase(modifyAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        const index = state.addresses.findIndex((address) => address.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;

          // Update default address if modified address is marked default
          if (action.payload.isDefault) {
            state.defaultAddress = action.payload;

            // Update isDefault for other addresses
            state.addresses.forEach((address) => {
              if (address.id !== action.payload.id) {
                address.isDefault = false;
              }
            });
          }
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
        state.addresses = state.addresses.filter((address) => address.id !== action.payload);

        // Reset default address if it was deleted
        if (state.defaultAddress?.id === action.payload) {
          state.defaultAddress = state.addresses[0] || null;
        }
      });
  },
});

// Export actions and reducer
export const { setDefaultAddress, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
