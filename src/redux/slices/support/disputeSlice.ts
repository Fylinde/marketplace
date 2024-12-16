import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import disputeService from "../../../services/disputeService";

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: "open" | "resolved" | "rejected" | "escalated";
  messages: Array<{ sender: "buyer" | "seller" | "admin"; text: string; timestamp: string }>;
}

interface DisputeState {
  disputes: Dispute[];
  loading: boolean;
  error: string | null;
}

const initialState: DisputeState = {
  disputes: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchDisputes = createAsyncThunk(
  "disputes/fetchDisputes",
  async (_, { rejectWithValue }) => {
    try {
      return await disputeService.getAllDisputes();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch disputes");
    }
  }
);

export const resolveDispute = createAsyncThunk(
  "disputes/resolveDispute",
  async (
    { disputeId, resolutionNote }: { disputeId: string; resolutionNote: string },
    thunkAPI
  ) => {
    try {
      return await disputeService.resolveDispute(disputeId, resolutionNote);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to resolve dispute"
      );
    }
  }
);



export const rejectDispute = createAsyncThunk(
  "disputes/rejectDispute",
  async (disputeId: string, { rejectWithValue }) => {
    try {
      return await disputeService.rejectDispute(disputeId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to reject dispute");
    }
  }
);

export const escalateDispute = createAsyncThunk(
  "disputes/escalateDispute",
  async (disputeId: string, thunkAPI) => {
    try {
      return await disputeService.escalateDispute(disputeId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to escalate dispute"
      );
    }
  }
);

const disputeSlice = createSlice({
  name: "disputes",
  initialState,
  reducers: {
    addMessageToDispute: (
      state,
      action: PayloadAction<{ disputeId: string; message: Dispute["messages"][0] }>
    ) => {
      const dispute = state.disputes.find((d) => d.id === action.payload.disputeId);
      if (dispute) {
        dispute.messages.push(action.payload.message);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisputes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        state.disputes = action.payload;
        state.loading = false;
      })
      .addCase(fetchDisputes.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Resolve Dispute
      .addCase(resolveDispute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        const updatedDispute = action.payload;
        const index = state.disputes.findIndex(
          (dispute) => dispute.id === updatedDispute.id
        );
        if (index !== -1) {
          state.disputes[index] = updatedDispute;
        }
        state.loading = false;
      })
      .addCase(resolveDispute.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(rejectDispute.fulfilled, (state, action) => {
        const dispute = state.disputes.find((d) => d.id === action.payload.id);
        if (dispute) {
          dispute.status = "rejected";
        }
      })

      // Escalate Dispute
      .addCase(escalateDispute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(escalateDispute.fulfilled, (state, action) => {
        const escalatedDispute = action.payload;
        const index = state.disputes.findIndex(
          (dispute) => dispute.id === escalatedDispute.id
        );
        if (index !== -1) {
          state.disputes[index] = escalatedDispute;
        }
        state.loading = false;
      })
      .addCase(escalateDispute.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { addMessageToDispute } = disputeSlice.actions;
export default disputeSlice.reducer;
