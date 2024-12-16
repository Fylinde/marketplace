// transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import transactionService from "../../../services/transactionService";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";


interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: string;
  description: string;
  selectedTransaction: string;
}

interface TransactionDetails {

  id: string;
  amount: number;
  status: string;
  date: string;
  buyer: string;
  seller: string;
  description: string;
}

interface TransactionState {
  selectedTransaction: string;
  transactions: Transaction[];
  details: TransactionDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  selectedTransaction: '',
  transactions: [],
  details: null,
  loading: false,
  error: null,
};

// Async Thunk for fetching transaction history
export const fetchTransactionHistory = createAsyncThunk<
  Transaction[],
  string,
  { rejectValue: string }
>("transactions/fetchTransactionHistory", async (userId, { rejectWithValue }) => {
  try {
    return await transactionService.fetchTransactionHistory(userId);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch transaction history");
  }
});

export const fetchTransactionDetails = createAsyncThunk(
  "transaction/fetchDetails",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      return await transactionService.getTransactionDetails(transactionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transaction details");
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });

    builder
      .addCase(fetchTransactionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionDetails.fulfilled, (state, action: PayloadAction<TransactionDetails>) => {
        state.details = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactionDetails.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const selectedTransaction = useSelector(
  (state: RootState) => state.transaction?.selectedTransaction // Match the actual state property
);


export default transactionSlice.reducer;
