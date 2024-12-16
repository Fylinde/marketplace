import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../../../services/notificationService";

export interface Notification {
  id: string;
  type: "order" | "dispute" | "promotion" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number; // Add unread count
    loading: boolean;
    error: string | null;
  }
  

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getAllNotifications();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      return await notificationService.markAsRead(notificationId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark notification as read");
    }
  }
);

export const clearNotifications = createAsyncThunk(
    "notifications/clearNotifications",
    async (_, { rejectWithValue }) => {
      try {
        return await notificationService.clearAllNotifications();
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to clear notifications");
      }
    }
);
  
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((notification: Notification) => !notification.read).length;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload.id);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(clearNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
  },
});

export const { markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
