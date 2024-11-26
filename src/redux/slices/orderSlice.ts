import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
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
  sort: "date" | "total" | "customerName";
  history: Order[];
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
  sort: "date",
  history: [],
};

// Thunks

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async (
    { orderId, status }: { orderId: string; status: Order["status"] },
    thunkAPI
  ) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      return { orderId, status: updatedOrder.status };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

// Fetch order history
export const fetchOrderHistory = createAsyncThunk(
  "orders/fetchOrderHistory",
  async (_, thunkAPI) => {
    try {
      const orders = await orderService.getOrderHistory();
      return orders; // Return fetched orders
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch order history");
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        if (state.byId[orderId]) {
          state.byId[orderId].status = status;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.history = action.payload; // Populate history with fetched orders
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetError, setFilters, setSort } = orderSlice.actions;
export default orderSlice.reducer;
