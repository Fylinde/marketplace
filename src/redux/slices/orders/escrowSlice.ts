import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import escrowService from "services/escrowService";
import axios, { AxiosResponse } from "axios";
import { extractErrorMessage } from "../../../types/extractErrorMessage";
// import { submitEvidence as submitEvidenceService } from "services/escrowService";
import { EscrowTransaction } from "../../../types/sharedTypes";


interface EvidenceSubmissionResponse {
  success: boolean;
  message: string;
}




interface EscrowState {
  evidenceSubmissionStatus: "idle" | "loading" | "succeeded" | "failed";
  transactions: EscrowTransaction[];
  disputeInfo: any | null; // Adjust `any` to the appropriate type
  deliveryTimeline: any[];
  analytics: {
    statusCounts: Record<string, number>;
    averageReleaseTime: number;
    disputeCount: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: EscrowState = {
  evidenceSubmissionStatus: "idle",
  transactions: [], // List of escrow transactions
  disputeInfo: null, // Add this
  deliveryTimeline: [], // Add this
  analytics: {
    statusCounts: {}, // Number of transactions by status (Pending, Released, Disputed)
    averageReleaseTime: 0, // Average time to release funds
    disputeCount: 0, // Total disputes
  },
  loading: false, // Loading state for fetching data
  error: null, // Error state
};


export const fetchDisputeInfo = createAsyncThunk(
  "escrow/fetchDisputeInfo",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      return await escrowService.fetchDisputeInfo(transactionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch dispute info");
    }
  }
);

export const fetchTimeline = createAsyncThunk(
  "escrow/fetchTimeline",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      return await escrowService.fetchTimeline(transactionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch delivery timeline");
    }
  }
);


// Use escrowService.submitEvidence in your thunk
export const submitEvidence = createAsyncThunk<
  EvidenceSubmissionResponse,
  FormData,
  { rejectValue: string }
>(
  "escrow/submitEvidence",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await escrowService.submitEvidence(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// Define Async Thunk
export const fetchEscrowAnalytics = createAsyncThunk<
  { statusCounts: Record<string, number>; averageReleaseTime: number; disputeCount: number },
  void,
  { rejectValue: string }
>(
  "escrow/fetchEscrowAnalytics",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/escrow/analytics");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch analytics");
    }
  }
);

// Fetch all escrow transactions
export const fetchEscrowTransactions = createAsyncThunk(
  "escrow/fetchEscrowTransactions",
  async (_, thunkAPI) => {
    try {
      return await escrowService.getEscrowTransactions();
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Create a new escrow transaction
export const createEscrowTransaction = createAsyncThunk(
  "escrow/createEscrowTransaction",
  async (
    {
      orderId,
      buyerName,
      sellerName,
      amount,
      currency,
      releaseDate,
    }: {
      orderId: string;
      buyerName: string;
      sellerName: string;
      amount: number;
      currency: string;
      releaseDate: string;
    },
    thunkAPI
  ) => {
    try {
      return await escrowService.createEscrowTransaction({
        orderId,
        buyerName,
        sellerName,
        amount,
        currency,
        releaseDate,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Release escrow funds
export const releaseEscrowFunds = createAsyncThunk(
  "escrow/releaseEscrowFunds",
  async (transactionId: string, thunkAPI) => {
    try {
      return await escrowService.releaseFunds(transactionId);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Dispute an escrow transaction
export const disputeEscrowTransaction = createAsyncThunk(
  "escrow/disputeEscrowTransaction",
  async (
    {
      transactionId,
      reason,
    }: {
      transactionId: string;
      reason: string;
    },
    thunkAPI
  ) => {
    try {
      return await escrowService.disputeTransaction(transactionId, reason);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Slice
const escrowSlice = createSlice({
  name: "escrow",
  initialState: initialState as EscrowState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchDisputeInfo
      .addCase(fetchDisputeInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisputeInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.disputeInfo = action.payload;
      })
      .addCase(fetchDisputeInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Cast to `string`
      })


      // Handle fetchTimeline
      .addCase(fetchTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryTimeline = action.payload;
      })
      .addCase(fetchTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Cast to `string`
      })

    builder
      .addCase(submitEvidence.pending, (state) => {
        state.evidenceSubmissionStatus = "loading";
        state.error = null;
      })
      .addCase(submitEvidence.fulfilled, (state) => {
        state.evidenceSubmissionStatus = "succeeded";
      })
      .addCase(submitEvidence.rejected, (state, action) => {
        state.evidenceSubmissionStatus = "failed";
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchEscrowAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEscrowAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchEscrowAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      // Fetch Escrow Transactions
      .addCase(fetchEscrowTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEscrowTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(fetchEscrowTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Escrow Transaction
      .addCase(createEscrowTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      // Release Funds
      .addCase(releaseEscrowFunds.fulfilled, (state, action) => {
        const transaction = state.transactions.find((t) => t.id === action.payload.id);
        if (transaction) {
          transaction.status = "Released";
        }
      })
      // Dispute Escrow
      .addCase(disputeEscrowTransaction.fulfilled, (state, action) => {
        const transaction = state.transactions.find((t) => t.id === action.payload.id);
        if (transaction) {
          transaction.status = "Disputed";
          transaction.disputeReason = action.payload.reason;
          transaction.resolutionStatus = "Unresolved";
        }
      });
  },
});

export default escrowSlice.reducer;
