import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import paymentService from "services/paymentService";
import { PaymentMethod } from "@/types/sharedTypes";


interface EscrowTransaction {
  orderId: string;
  buyerName: string;
  amount: number;
  buyerCurrency: string;
  status: "Pending" | "Released" | "Disputed";
  releaseDate: string;
}

interface Transaction {
  orderId: string;
  buyerCurrency: string;
  buyerAmount: number;
  sellerCurrency: string;
  sellerAmount: number;
  exchangeFee: number;
  paymentMethod: string;
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  escrowTransactions: EscrowTransaction[];
  transactions: Transaction[];
  sellerCurrency: string;
  cryptoAcceptance: boolean;
  exchangeRates: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentMethods: [],
  escrowTransactions: [],
  transactions: [],
  sellerCurrency: "USD",
  cryptoAcceptance: false,
  exchangeRates: {},
  loading: false,
  error: null,
};

// Async Thunks

// Fetch all payment methods
export const fetchPaymentMethods = createAsyncThunk(
    "payments/fetchPaymentMethods",
    async (_, thunkAPI) => {
      try {
        const response = await paymentService.getPaymentMethods();
        return response; // If the response is already an array
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to fetch payment methods.");
      }
    }
  );
  

// Add or update a payment method
export const savePaymentMethod = createAsyncThunk<PaymentMethod, PaymentMethod>(
  "payments/savePaymentMethod",
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
  "payments/deletePaymentMethod",
  async (id: string, thunkAPI) => {
    try {
      await paymentService.deletePaymentMethod(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete payment method.");
    }
  }
);

// Fetch escrow transactions
export const fetchEscrowTransactions = createAsyncThunk(
    "payments/fetchEscrowTransactions",
    async (_, thunkAPI) => {
      try {
        const response = await paymentService.getEscrowTransactions();
        return response; // Assuming the response is the transaction array
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to fetch escrow transactions.");
      }
    }
  );
  

// Toggle crypto payment acceptance
export const toggleCryptoAcceptance = createAsyncThunk(
    "payments/toggleCryptoAcceptance",
    async (_, thunkAPI) => {
      try {
        const response = await paymentService.toggleCryptoAcceptance();
        return response.cryptoAcceptance; // Extract cryptoAcceptance directly
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to update crypto acceptance.");
      }
    }
  );
  

// Fetch exchange rates
export const fetchExchangeRates = createAsyncThunk(
    "payments/fetchExchangeRates",
    async (_, thunkAPI) => {
      try {
        const response = await paymentService.getExchangeRates();
        return response; // Assuming the response itself is the exchange rates object
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to fetch exchange rates.");
      }
    }
);
  
export const fetchPaymentData = createAsyncThunk(
    "payments/fetchPaymentData",
    async (_, thunkAPI) => {
      try {
        const paymentMethods = await paymentService.getPaymentMethods();
        const escrowTransactions = await paymentService.getEscrowTransactions();
        const exchangeRates = await paymentService.getExchangeRates();
  
        return { paymentMethods, escrowTransactions, exchangeRates };
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to fetch payment data.");
      }
    }
);
  
export const updateSellerCurrency = createAsyncThunk(
    "payments/updateSellerCurrency",
    async (currency: string, thunkAPI) => {
      try {
        // Hypothetical API call for updating the seller's currency
        const updatedCurrency = await paymentService.updateSellerCurrency(currency);
        return updatedCurrency;
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to update seller currency.");
      }
    }
  );
  
  export const updatePaymentMethod = createAsyncThunk(
    "payments/updatePaymentMethod",
    async ({ id, updates }: { id: string; updates: Partial<PaymentMethod> }, thunkAPI) => {
      try {
        return await paymentService.updatePaymentMethod({ id, updates });
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to update the payment method.");
      }
    }
  );
  
  
  
  export const createPaymentMethod = createAsyncThunk(
    "payments/createPaymentMethod",
    async (method: PaymentMethod, thunkAPI) => {
      try {
        const newMethod = await paymentService.createPaymentMethod(method);
        return newMethod;
      } catch (error) {
        return thunkAPI.rejectWithValue("Failed to create payment method.");
      }
    }
  );
  
  export const refundPaymentThunk = createAsyncThunk<
  { success: boolean; reason?: string },
  { paymentId: string; currency: string },
  { rejectValue: string }
>("payments/refundPayment", async ({ paymentId, currency }, thunkAPI) => {
  try {
    const response = await paymentService.refundPayment(paymentId, currency);
    if (!response.success) throw new Error(response.reason);
    return response; // Success response
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to process refund");
  }
});


// Slice
const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setSellerCurrency(state, action: PayloadAction<string>) {
      state.sellerCurrency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(refundPaymentThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(refundPaymentThunk.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(refundPaymentThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Refund failed";
        })
    builder
        // Fetch Payment Data
        .addCase(fetchPaymentData.fulfilled, (state, action) => {
        state.paymentMethods = action.payload.paymentMethods;
        state.escrowTransactions = action.payload.escrowTransactions;
        state.exchangeRates = action.payload.exchangeRates;
        })
        // Update Seller Currency
        .addCase(updateSellerCurrency.fulfilled, (state, action) => {
        state.sellerCurrency = action.payload;
        })
        // Update Payment Method
        .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        const index = state.paymentMethods.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
            state.paymentMethods[index] = action.payload;
        }
        })
        // Create Payment Method
        .addCase(createPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods.push(action.payload);
        })
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
      // Fetch Escrow Transactions
      .addCase(fetchEscrowTransactions.fulfilled, (state, action: PayloadAction<EscrowTransaction[]>) => {
        state.escrowTransactions = action.payload;
      })
      
      // Toggle Crypto Acceptance
      .addCase(toggleCryptoAcceptance.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.cryptoAcceptance = action.payload;
      })      
      // Fetch Exchange Rates
      .addCase(fetchExchangeRates.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
        state.exchangeRates = action.payload;
      });
      
  },
});

export const { setSellerCurrency } = paymentSlice.actions;

export default paymentSlice.reducer;
