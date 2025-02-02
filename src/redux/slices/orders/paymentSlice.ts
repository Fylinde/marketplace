import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import paymentService from "../../../services/paymentService";
import { PaymentMethod } from "../../../types/sharedTypes";
import { EscrowTransaction } from "../../../types/sharedTypes";
import { BillingAddress, PaymentDetails } from "../../../types/sharedTypes";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { tokenizePaymentDetails } from "../../../services/paymentService";
import { saveBankAccountDetails } from "../../../services/paymentService";
import { BankAccountVerification as BankAccountVerificationType } from "../../../types/sharedTypes";
import { resendVerificationCode } from "../../../services/paymentService";

interface RefundStatus {
  id: string;
  orderId: string;
  status: string;
  reason: string;
  estimatedResolution: number | null;
  amount: number;
  currency: string;
  additionalNotes?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  date: string;
  method: string;
}

// Types
interface Transaction {
  orderId: string;
  buyerCurrency: string;
  buyerAmount: number;
  sellerCurrency: string;
  sellerAmount: number;
  paymentBreakdown: {
    method: string;
    amount: number;
  }[];
  exchangeFee: number;
  paymentMethod: string;
}

interface PaymentState {
  history: PaymentRecord[];
  billingHistory: any[];
  escrowTransactions: EscrowTransaction[]; // Add this
  sellerCurrency: string; // Add this
  cryptoAcceptance: boolean; // Add this
  paymentData: any;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  transaction: Transaction | null;
  loading: boolean;
  error: string | null;
  defaultPayoutMethod: PaymentMethod | null; // Added
  cryptoAccepted: boolean; // New property
  refundStatuses: RefundStatus[];
  currentPaymentMethodId: string;
  selectedPaymentMethod: string;
  token: string | null;
  bankAccountStatus: string | null;
}

const initialState: PaymentState = {
  history: [],
  billingHistory: [],
  escrowTransactions: [], // Add this
  sellerCurrency: "USD", // Default value
  cryptoAcceptance: false, // Default value
  paymentData: null,
  paymentMethods: [],
  transactions: [],
  transaction: null,
  loading: false,
  error: null,
  defaultPayoutMethod: null, // Added
  cryptoAccepted: false, // Default value
  refundStatuses: [],
  currentPaymentMethodId: '',
  selectedPaymentMethod: '',
  token: null,
  bankAccountStatus: null,
};


// Async thunk to fetch payment history
export const fetchPaymentHistory = createAsyncThunk(
  "payment/fetchPaymentHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentHistory();
      return response; // Ensure this matches the response shape from your API
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment history.");
    }
  }
);

// Async Thunks
export const fetchBillingHistory = createAsyncThunk(
  "payment/fetchBillingHistory",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await paymentService.fetchBillingHistory(userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

export const processPayment = createAsyncThunk(
  "payment/processPayment",
  async (paymentDetails: PaymentDetails, { rejectWithValue }) => {
    try {
      await paymentService.processPayment(paymentDetails);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);


export const fetchTransactionHistory = createAsyncThunk(
  "transaction/fetchTransactionHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.fetchTransactionHistory();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch transaction history");
    }
  }
);

export const fetchTransactionDetails = createAsyncThunk(
  "transaction/fetchTransactionDetails",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      return await paymentService.fetchTransactionDetails(transactionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch transaction details");
    }
  }
);


export const fetchRefundStatuses = createAsyncThunk<
  RefundStatus[], // Resolved value type
  void,           // Argument type
  { rejectValue: string } // Rejected value type
>(
  "refund/fetchRefundStatuses",
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.fetchRefundStatuses();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch refund statuses");
    }
  }
);

// Fetch payment data thunk
export const fetchPaymentData = createAsyncThunk<
  any, // Resolved value
  void, // No arguments
  { rejectValue: string }
>("payment/fetchPaymentData", async (_, thunkAPI) => {
  try {
    const response = await paymentService.fetchPaymentData();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch payment data.");
  }
});

// Create payment method thunk
export const createPaymentMethod = createAsyncThunk<
  PaymentMethod, // Resolved value type
  PaymentMethod, // Argument type
  { rejectValue: string }
>("payment/createPaymentMethod", async (method, thunkAPI) => {
  try {
    // Add `details` field dynamically if required
    const methodWithDetails = { ...method, details: method.details || {} };
    const response = await paymentService.createPaymentMethod(methodWithDetails);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to create payment method.");
  }
});


/**
 * Thunk for refunding a payment
 */
export const refundPaymentThunk = createAsyncThunk<
  { success: boolean; message: string }, // Resolved type
  { paymentId: string; currency: string }, // Updated argument type
  { rejectValue: string } // Rejected type
>(
  "payment/refundPayment",
  async ({ paymentId, currency }, thunkAPI) => {
    try {
      // Include additional parameters in the API call if needed
      const response = await paymentService.refundPayment({ paymentId, currency });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to process the refund.");
    }
  }
);



export const toggleCryptoAcceptance = createAsyncThunk<
  { success: boolean; message: string }, // Return type
  boolean,                              // Argument type
  { rejectValue: string }               // Rejection type
>(
  "payment/toggleCryptoAcceptance",
  async (acceptCrypto, thunkAPI) => {
    try {
      const response = await paymentService.toggleCryptoAcceptance(acceptCrypto);
      return response; // Expected response contains success and message
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to toggle cryptocurrency acceptance.");
    }
  }
);


export const setDefaultPayoutMethod = createAsyncThunk(
  "payments/setDefaultPayoutMethod",
  async (methodId: string, thunkAPI) => {
    try {
      const response = await paymentService.setDefaultPayoutMethod(methodId);
      return response; // Assume the API returns the updated default method
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to set default payout method.");
    }
  }
);


export const updatePaymentMethod = createAsyncThunk(
  "payments/updatePaymentMethod",
  async ({ id, updates }: { id: string; updates: Partial<PaymentMethod> }, thunkAPI) => {
    try {
      const response = await paymentService.updatePaymentMethod({ id, updates });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update the payment method.");
    }
  }
);


// Fetch all payment methods
export const fetchPaymentMethods = createAsyncThunk(
  "payment/fetchPaymentMethods",
  async (_, thunkAPI) => {
    try {
      return await paymentService.getPaymentMethods();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch payment methods.");
    }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  "payments/setDefaultPaymentMethod",
  async (id: string, thunkAPI) => {
    try {
      const response = await paymentService.setDefaultPaymentMethod(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to set default payment method.");
    }
  }
);

export const reorderPaymentMethods = createAsyncThunk(
  "payments/reorderPaymentMethods",
  async (updatedOrder: string[], thunkAPI) => {
    try {
      const response = await paymentService.reorderPaymentMethods(updatedOrder);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to reorder payment methods.");
    }
  }
);

// Add or update a payment method
export const savePaymentMethod = createAsyncThunk<PaymentMethod, PaymentMethod>(
  "payment/savePaymentMethod",
  async (method, thunkAPI) => {
    try {
      if (method.id) {
        return await paymentService.updatePaymentMethod({ id: method.id, updates: method });
      } else {
        return await paymentService.createPaymentMethod(method);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to save payment method.");
    }
  }
);

// Delete a payment method
export const deletePaymentMethod = createAsyncThunk(
  "payment/deletePaymentMethod",
  async (id: string, thunkAPI) => {
    try {
      await paymentService.deletePaymentMethod(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete payment method.");
    }
  }
);

export const saveBankAccountDetailsThunk = createAsyncThunk<
  string, // The resolved payload type
  { data: BankAccountVerificationType; proofFile: File }, // The argument type
  { rejectValue: string } // The reject value type
>(
  "payment/saveBankAccountDetails",
  async ({ data, proofFile }, { rejectWithValue }) => {
    try {
      const status = await saveBankAccountDetails(data, proofFile);
      console.log("Backend status:", status);
      return status;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a transaction with partial payment
export const createTransaction = createAsyncThunk(
  "payment/createTransaction",
  async (
    {
      orderId,
      buyerCurrency,
      paymentBreakdown,
    }: {
      orderId: string;
      buyerCurrency: string;
      paymentBreakdown: { method: string; amount: number }[];
    },
    thunkAPI
  ) => {
    try {
      return await paymentService.createTransaction(orderId, buyerCurrency, paymentBreakdown);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to create transaction.");
    }
  }
);

// Async thunk for tokenizing payment details
export const tokenizePaymentDetailsThunk = createAsyncThunk(
  "payment/tokenizePaymentDetails",
  async (details: PaymentDetails, { rejectWithValue }) => {
    try {
      const token = await tokenizePaymentDetails(details);
      return token;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);



/**
 * Thunk to resend verification code for a seller via vendor-service.
 */
export const resendVerificationCodeThunk = createAsyncThunk<
  string, // Resolved payload type
  string, // Email as input type
  { rejectValue: string } // Reject value type
>(
  "auth/resendVerificationCode",
  async (email: string, { rejectWithValue }) => {
    try {
      const message = await resendVerificationCode(email);
      return message;
    } catch (error: any) {
      console.error("Error resending verification code:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend verification code. Please try again."
      );
    }
  }
);


// Slice
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action: PayloadAction<PaymentRecord[]>) => {
        state.history = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
    builder
      .addCase(fetchBillingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingHistory.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.billingHistory = action.payload;
        state.loading = false;
      })
      .addCase(fetchBillingHistory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(processPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Cast to string
      })
      .addCase(fetchTransactionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(fetchTransactionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Cast to string
      });
    builder
      .addCase(fetchRefundStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefundStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.refundStatuses = action.payload;
      })
      .addCase(fetchRefundStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchPaymentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentData.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(fetchPaymentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred while fetching payment data.";
      })
      .addCase(createPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods.push(action.payload);
      })
      .addCase(createPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred while creating payment method.";
      });

    builder
      // Handle refund payment actions
      .addCase(refundPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundPaymentThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, update the state if needed based on action.payload
        console.log("Refund successful:", action.payload.message);
      })
      .addCase(refundPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    builder
      .addCase(toggleCryptoAcceptance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCryptoAcceptance.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptoAccepted = action.payload.success; // Update crypto acceptance status
      })
      .addCase(toggleCryptoAcceptance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    builder
      .addCase(setDefaultPayoutMethod.fulfilled, (state, action) => {
        state.defaultPayoutMethod = action.payload;
      });

    builder
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        const index = state.paymentMethods.findIndex((m) => m.id === action.payload.id);
        if (index > -1) {
          state.paymentMethods[index] = action.payload;
        }
      });

    builder
      // Fetch Payment Methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Save Payment Method
      .addCase(savePaymentMethod.fulfilled, (state, action: PayloadAction<PaymentMethod>) => {
        const index = state.paymentMethods.findIndex((m) => m.id === action.payload.id);
        if (index > -1) {
          state.paymentMethods[index] = action.payload;
        } else {
          state.paymentMethods.push(action.payload);
        }
      })
      // Delete Payment Method
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods = state.paymentMethods.filter((m) => m.id !== action.payload);
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        state.loading = false;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder
      .addCase(tokenizePaymentDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(tokenizePaymentDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(tokenizePaymentDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder
      .addCase(saveBankAccountDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBankAccountDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccountStatus = action.payload; // Save the status
      })
      .addCase(saveBankAccountDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save bank account details.";
      });
  },
});




// Remove the hook and export a selector function instead
export const selectPaymentMethodId = (state: RootState) => state.payments?.currentPaymentMethodId;

export default paymentSlice.reducer;
