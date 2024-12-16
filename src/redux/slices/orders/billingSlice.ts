import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BillingInformation } from "@/types/sharedTypes";
import billingService from "../../../services/billingService";


export interface BillingSummary {
  totalBilled: number;
  pendingInvoices: number;
  lastBillingDate: string;
}

interface BillingState {
  billingInformation: BillingInformation[]; // List of billing details
  billingSummary: BillingSummary | null;
  loading: boolean; // Loading state for async operations
  error: string | null; // Error messages for failed operations
}

const initialState: BillingState = {
  billingInformation: [],
  billingSummary: null,
  loading: false,
  error: null,
};

export const fetchBillingSummary = createAsyncThunk(
  "billing/fetchBillingSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await billingService.getBillingSummary();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch billing summary.");
    }
  }
);

// Fetch all saved billing details
export const loadBillingInformation = createAsyncThunk(
  "billing/loadBillingDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/billing"); // Replace with your API endpoint
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load billing details.");
    }
  }
);

// Add a new billing detail
export const saveBillingInformation = createAsyncThunk(
  "billing/saveBillingDetail",
  async (billingInformation: BillingInformation, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/billing", billingInformation);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to save billing detail.");
    }
  }
);

// Update an existing billing detail
export const modifyBillingInformation = createAsyncThunk(
  "billing/modifyBillingDetail",
  async ({ id, billingInformation }: { id: string; billingInformation: BillingInformation }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/billing/${id}`, billingInformation);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to modify billing detail.");
    }
  }
);

// Delete a billing detail
export const deleteBillingInformation = createAsyncThunk(
  "billing/deleteBillingDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/billing/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete billing detail.");
    }
  }
);

// Billing Slice
const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Billing Summary
      .addCase(fetchBillingSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingSummary.fulfilled, (state, action: PayloadAction<BillingSummary>) => {
        state.billingSummary = action.payload;
        state.loading = false;
      })
      .addCase(fetchBillingSummary.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
    builder
      // Load Billing Details
      .addCase(loadBillingInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBillingInformation.fulfilled, (state, action: PayloadAction<BillingInformation[]>) => {
        state.billingInformation = action.payload;
        state.loading = false;
      })
      .addCase(loadBillingInformation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Save Billing Detail
      .addCase(saveBillingInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBillingInformation.fulfilled, (state, action: PayloadAction<BillingInformation>) => {
        state.billingInformation.push(action.payload);
        state.loading = false;
      })
      .addCase(saveBillingInformation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Modify Billing Detail
      .addCase(modifyBillingInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modifyBillingInformation.fulfilled, (state, action: PayloadAction<BillingInformation>) => {
        const index = state.billingInformation.findIndex((billing) => billing.id === action.payload.id);
        if (index !== -1) {
          state.billingInformation[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(modifyBillingInformation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Delete Billing Detail
      .addCase(deleteBillingInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBillingInformation.fulfilled, (state, action: PayloadAction<string>) => {
        state.billingInformation = state.billingInformation.filter((billing) => billing.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteBillingInformation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

// Export the reducer
export default billingSlice.reducer;
