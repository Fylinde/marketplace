import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fraudService, FraudReport, FraudInsight } from "../../../services/fraudService";

interface FraudState {
  fraudulentOrders: FraudReport[];
  insights: FraudInsight[];
  reports: FraudReport[];
  loading: boolean;
  error: string | null;
}

const initialState: FraudState = {
  fraudulentOrders: [],
  insights: [],
  reports: [],
  loading: false,
  error: null,
};


// Fetch fraudulent orders
export const fetchFraudulentOrders = createAsyncThunk<
  FraudReport[],
  void,
  { rejectValue: string }
>("fraud/fetchFraudulentOrders", async (_, thunkAPI) => {
  try {
    return await fraudService.fetchFraudulentOrders();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch fraudulent orders");
  }
});


// Mark an order as fraudulent
export const markOrderAsFraudulent = createAsyncThunk<
  FraudReport,
  string,
  { rejectValue: string }
>("fraud/markOrderAsFraudulent", async (orderId, thunkAPI) => {
  try {
    return await fraudService.markOrderAsFraudulent(orderId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to mark order as fraudulent");
  }
});

// Resolve a fraudulent order
export const resolveFraudulentOrder = createAsyncThunk<
  FraudReport,
  string,
  { rejectValue: string }
>("fraud/resolveFraudulentOrder", async (orderId, thunkAPI) => {
  try {
    return await fraudService.resolveFraudulentOrder(orderId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to resolve fraudulent order");
  }
});

// Fetch fraud insights
export const fetchFraudInsights = createAsyncThunk<
  FraudInsight[],
  void,
  { rejectValue: string }
>("fraud/fetchFraudInsights", async (_, thunkAPI) => {
  try {
    return await fraudService.fetchFraudInsights();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch fraud insights");
  }
});

// Async thunk to fetch all fraud reports
export const fetchFraudReports = createAsyncThunk<
  FraudReport[], // Successful payload type
  void,          // Argument type
  { rejectValue: string } // Rejection payload type
>("fraud/fetchFraudReports", async (_, thunkAPI) => {
  try {
    return await fraudService.getAllFraudReports();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch fraud reports");
  }
});

// Async thunk to submit a fraud report
export const submitFraudReport = createAsyncThunk<
  FraudReport,   // Successful payload type
  { orderId: string; reason: string }, // Argument type
  { rejectValue: string } // Rejection payload type
>("fraud/submitFraudReport", async ({ orderId, reason }, thunkAPI) => {
  try {
    return await fraudService.submitFraudReport(orderId, reason);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to submit fraud report");
  }
});

// Async thunk to update a fraud report status
export const updateFraudReportStatus = createAsyncThunk<
  FraudReport,   // Successful payload type
  { reportId: string; status: string }, // Argument type
  { rejectValue: string } // Rejection payload type
>("fraud/updateFraudReportStatus", async ({ reportId, status }, thunkAPI) => {
  try {
    return await fraudService.updateFraudReportStatus(reportId, status);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update fraud report status"
    );
  }
});

const fraudSlice = createSlice({
  name: "fraud",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch fraudulent orders
      .addCase(fetchFraudulentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFraudulentOrders.fulfilled, (state, action: PayloadAction<FraudReport[]>) => {
        state.fraudulentOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchFraudulentOrders.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An error occurred while fetching fraudulent orders.";
        state.loading = false;
      })

      // Mark an order as fraudulent
      .addCase(markOrderAsFraudulent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markOrderAsFraudulent.fulfilled, (state, action: PayloadAction<FraudReport>) => {
        state.fraudulentOrders.push(action.payload);
        state.loading = false;
      })
      .addCase(markOrderAsFraudulent.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An error occurred while marking the order as fraudulent.";
        state.loading = false;
      })

      // Resolve a fraudulent order
      .addCase(resolveFraudulentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveFraudulentOrder.fulfilled, (state, action: PayloadAction<FraudReport>) => {
        const index = state.fraudulentOrders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.fraudulentOrders[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(resolveFraudulentOrder.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An error occurred while resolving the fraudulent order.";
        state.loading = false;
      })

      // Fetch fraud insights
      .addCase(fetchFraudInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFraudInsights.fulfilled, (state, action: PayloadAction<FraudInsight[]>) => {
        state.insights = action.payload;
        state.loading = false;
      })
      .addCase(fetchFraudInsights.rejected, (state, action) => {
        state.error = action.payload || "An error occurred while fetching fraud insights.";
        state.loading = false;
      });
    builder
      // Fetch fraud reports
      .addCase(fetchFraudReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFraudReports.fulfilled, (state, action: PayloadAction<FraudReport[]>) => {
        state.reports = action.payload;
        state.loading = false;
      })
      .addCase(fetchFraudReports.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An error occurred while fetching fraud reports.";
        state.loading = false;
      })

      // Submit a fraud report
      .addCase(submitFraudReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFraudReport.fulfilled, (state, action: PayloadAction<FraudReport>) => {
        state.reports.push(action.payload);
        state.loading = false;
      })
      .addCase(submitFraudReport.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An error occurred while submitting the fraud report.";
        state.loading = false;
      })

      // Update fraud report status
      .addCase(updateFraudReportStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFraudReportStatus.fulfilled, (state, action: PayloadAction<FraudReport>) => {
        const index = state.reports.findIndex((report) => report.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateFraudReportStatus.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An error occurred while updating the fraud report status.";
        state.loading = false;
      });
  },
});

export default fraudSlice.reducer;
