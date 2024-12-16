import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Order } from "types/order";
import orderService from "services/orderService";

// Selector to get an order by its ID
export const selectOrderById = (state: RootState, orderId: string): Order | undefined =>
  state.orders.byId[orderId];


// OrderState interface
export interface OrderStateFilters {
  status?: Order["status"];
  startDate?: string;
  endDate?: string;
  customerName?: string;
}

export interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  byId: Record<string, Order>;
  allIds: string[];
  currentOrder: Order | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  filters: OrderStateFilters;
  deliveryEstimate: string | null;
  sort: "date" | "total" | "customerName";
  history: Order[];
  refundStatus: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  byId: {},
  allIds: [],
  currentOrder: null,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  filters: {},
  deliveryEstimate: null,
  sort: "date",
  history: [],
  refundStatus: null,
};

// Thunks

// Update order status
export const updateOrderStatus = createAsyncThunk<
  { orderId: string; status: Order["status"] },
  { orderId: string; status: Order["status"] },
  { rejectValue: string }
>("orders/updateOrderStatus", async ({ orderId, status }, thunkAPI) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    return { orderId, status: updatedOrder.status };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update order status");
  }
});


// Fetch order history
export const fetchOrderHistory = createAsyncThunk(
  "orders/fetchOrderHistory",
  async (
    { page = 1, filters = {} }: { page?: number; filters?: Record<string, any> },
    thunkAPI
  ) => {
    try {
      const orders = await orderService.getOrderHistory(page, filters);
      return orders;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order history"
      );
    }
  }
);

// Example async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async ({ page, filters, sort }: { page: number; filters: any; sort: string }, thunkAPI) => {
    try {
      const response = await fetch(`/api/orders?page=${page}&sort=${sort}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      return data.orders; // Return orders data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async Thunk to Fetch Order by ID
export const fetchOrderById = createAsyncThunk<Order, string, { rejectValue: string }>(
  'orders/fetchOrderById',
  async (orderId, thunkAPI) => {
    try {
      const order = await orderService.getOrderById(orderId); // Call the service function
      return order; // Return the fetched order
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch order';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Fetch Order Details Thunk
export const fetchOrderDetails = createAsyncThunk<Order, string, { rejectValue: string }>(
  "orders/fetchOrderDetails",
  async (orderId, thunkAPI) => {
    try {
      const order = await orderService.fetchOrderDetails(orderId);
      return order;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch order details";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData: Partial<Order>, thunkAPI) => {
    try {
      // Assert required fields
      if (
        !orderData.shippingAddress || // Ensure shippingAddress exists
        !orderData.billingAddress || // Ensure billingAddress exists
        !orderData.items ||
        !orderData.buyerCurrency ||
        !orderData.sellerCurrency
      ) {
        return thunkAPI.rejectWithValue("Missing required order fields.");
      }

      // Validate that shippingAddress and billingAddress are non-empty arrays
      if (orderData.shippingAddress.length === 0 || orderData.billingAddress.length === 0) {
        return thunkAPI.rejectWithValue("Shipping and billing addresses cannot be empty.");
      }

      // Extract IDs from shippingAddress and billingAddress
      const shippingAddressId = orderData.shippingAddress[0]?.id;
      const billingAddressId = orderData.billingAddress[0]?.id;

      if (!shippingAddressId || !billingAddressId) {
        return thunkAPI.rejectWithValue("Shipping and billing address IDs are required.");
      }

      // Destructure after validation
      const {
        buyerPrice = 0,
        sellerPrice = 0,
        totalBuyerPrice = 0,
        totalSellerPrice = 0,
        buyerCurrency,
        sellerCurrency,
        items,
      } = orderData;

      // Create payload with IDs
      const payload = {
        buyerPrice,
        sellerPrice,
        totalBuyerPrice,
        totalSellerPrice,
        buyerCurrency,
        sellerCurrency,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })), // Ensure correct item shape
        shippingAddressId,
        billingAddressId,
      };

      return await orderService.placeOrder(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to place order"
      );
    }
  }
);






// Request Refund Thunk
export const requestRefund = createAsyncThunk<
  { message: string },
  { orderId: string; reason: string },
  { rejectValue: string }
>(
  "orders/requestRefund",
  async ({ orderId, reason }, thunkAPI) => {
    try {
      const response = await orderService.requestRefund(orderId, reason);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to request refund";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    setFilters(state, action: PayloadAction<OrderStateFilters>) {
      state.filters = action.payload;
    },
    setSort(state, action: PayloadAction<OrderState["sort"]>) {
      state.sort = action.payload;
    },
    setDeliveryEstimate(state, action: PayloadAction<string>) {
      state.deliveryEstimate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        const order = action.payload;
        state.selectedOrder = order;
        state.byId[order.id] = order;
        if (!state.allIds.includes(order.id)) {
          state.allIds.push(order.id);
        }
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        const order = action.payload;
        state.orders.push(order);
        state.deliveryEstimate = order.estimatedDeliveryDate || null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order details';
      })

      // Request Refund
      .addCase(requestRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.refundStatus = null;
      })
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.refundStatus = action.payload.message;
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to request refund';
      });
    builder
      // Handle fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.error = null;
        state.selectedOrder = action.payload;
        state.byId[action.payload.id] = action.payload; // Cache the order by ID
        if (!state.allIds.includes(action.payload.id)) {
          state.allIds.push(action.payload.id); // Ensure the ID is tracked in the allIds array
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      });
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        if (state.byId[orderId as string]) {
          state.byId[orderId as string].status = status as Order["status"]; // Explicit cast
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update order status";
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.history = action.payload; // Populate history with fetched orders
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Selector to retrieve an order by ID
export const selectOrder = (state: RootState, orderId: string): Order | undefined =>
  state.orders.byId[orderId];

export const { resetError, setFilters, setDeliveryEstimate, setSort } = orderSlice.actions;
export default orderSlice.reducer;

// Selector to retrieve an order by ID

