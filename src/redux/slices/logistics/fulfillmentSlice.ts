import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import fulfillmentService, { FulfillmentOrder, FulfillmentOption } from "../../../services/fulfillmentService";

interface FulfillmentState {
  orders: FulfillmentOrder[];
  options: FulfillmentOption[];
  currentOrder: FulfillmentOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: FulfillmentState = {
  options: [] as FulfillmentOption[],
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};



// Fetch all fulfillment options
export const fetchFulfillmentOptions = createAsyncThunk<
  FulfillmentOption[], // Successful payload type
  void,               // Argument type
  { rejectValue: string } // Rejection payload type
>("fulfillment/fetchOptions", async (_, thunkAPI) => {
  try {
    return await fulfillmentService.fetchFulfillmentOptions();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch options");
  }
});

// Add a new fulfillment option
export const addFulfillmentOption = createAsyncThunk<
  FulfillmentOption,                        // Success payload type
  Omit<FulfillmentOption, "id">,            // Argument type
  { rejectValue: string }                   // Rejection payload type
>("fulfillment/addFulfillmentOption", async (newOption, thunkAPI) => {
  try {
    return await fulfillmentService.addOption(newOption);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add fulfillment option");
  }
});


// Update an existing fulfillment option
export const updateFulfillmentOption = createAsyncThunk<
  FulfillmentOption,   // Successful payload type
  { id: string; updates: Partial<Omit<FulfillmentOption, "id">> }, // Argument type
  { rejectValue: string } // Rejection payload type
>("fulfillment/updateOption", async ({ id, updates }, thunkAPI) => {
  try {
    return await fulfillmentService.updateFulfillmentOption(id, updates);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update option");
  }
});

// Delete a fulfillment option
export const deleteFulfillmentOption = createAsyncThunk<
  string, // Successful payload type (ID of deleted option)
  string, // Argument type (optionId)
  { rejectValue: string } // Rejection payload type
>("fulfillment/deleteOption", async (optionId, thunkAPI) => {
  try {
    await fulfillmentService.deleteFulfillmentOption(optionId);
    return optionId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete option");
  }
});


// Fetch all fulfillment Orders
export const fetchFulfillmentOrders = createAsyncThunk<
  FulfillmentOrder[], // Successful payload type
  void,               // Argument type
  { rejectValue: string } // Rejection payload type
>("fulfillment/fetchOrders", async (_, thunkAPI) => {
  try {
    return await fulfillmentService.fetchFulfillmentOrders();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});

export const updateOrderStatus = createAsyncThunk<
  FulfillmentOrder,   // Successful payload type
  { orderId: string; status: "fulfilled" | "cancelled" }, // Argument type
  { rejectValue: string } // Rejection payload type
>("fulfillment/updateStatus", async ({ orderId, status }, thunkAPI) => {
  try {
    return await fulfillmentService.updateOrderStatus(orderId, status);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update order status");
  }
});

export const getFulfillmentDetails = createAsyncThunk<
  FulfillmentOrder,   // Successful payload type
  string,             // Argument type (orderId)
  { rejectValue: string } // Rejection payload type
>("fulfillment/getDetails", async (orderId, thunkAPI) => {
  try {
    return await fulfillmentService.getFulfillmentDetails(orderId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
  }
});

// Slice
const fulfillmentSlice = createSlice({
  name: "fulfillment",
  initialState,
  reducers: {
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch fulfillment options
      .addCase(fetchFulfillmentOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFulfillmentOptions.fulfilled, (state, action: PayloadAction<FulfillmentOption[]>) => {
        state.options = action.payload;
        state.loading = false;
      })
      .addCase(fetchFulfillmentOptions.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Failed to fetch options";
        state.loading = false;
      })

      // Add a fulfillment option
      .addCase(addFulfillmentOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFulfillmentOption.fulfilled, (state, action: PayloadAction<FulfillmentOption>) => {
        state.options.push(action.payload);
        state.loading = false;
      })
      .addCase(addFulfillmentOption.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An error occurred while adding the fulfillment option.";
        state.loading = false;
      })


      // Update a fulfillment option
      .addCase(updateFulfillmentOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFulfillmentOption.fulfilled, (state, action: PayloadAction<FulfillmentOption>) => {
        const index = state.options.findIndex((option) => option.id === action.payload.id);
        if (index !== -1) {
          state.options[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateFulfillmentOption.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Failed to update option";
        state.loading = false;
      })

      // Delete a fulfillment option
      .addCase(deleteFulfillmentOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFulfillmentOption.fulfilled, (state, action: PayloadAction<string>) => {
        state.options = state.options.filter((option) => option.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteFulfillmentOption.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Failed to delete option";
        state.loading = false;
      });
    builder
      // Fetch orders
      .addCase(fetchFulfillmentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFulfillmentOrders.fulfilled, (state, action: PayloadAction<FulfillmentOrder[]>) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchFulfillmentOrders.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Failed to fetch orders";
        state.loading = false;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<FulfillmentOrder>) => {
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Failed to update order status";
        state.loading = false;
      })

      // Get fulfillment details
      .addCase(getFulfillmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFulfillmentDetails.fulfilled, (state, action: PayloadAction<FulfillmentOrder>) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })
      .addCase(getFulfillmentDetails.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Failed to fetch order details";
        state.loading = false;
      });
  },
});

export const { resetCurrentOrder } = fulfillmentSlice.actions;
export default fulfillmentSlice.reducer;
