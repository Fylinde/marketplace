import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import feedbackService, { Feedback } from "../../../services/feedbackService";
import { RootState } from "../../store";



interface FeedbackState {
  feedbackList: Feedback[];
  loading: boolean;
  error: string | null;
  averageRating: number;
}

const initialState: FeedbackState = {
  feedbackList: [],
  loading: false,
  error: null,
  averageRating: 0,
};

// Async Thunks
export const respondToFeedback = createAsyncThunk(
  "feedback/respondToFeedback",
  async (
    { feedbackId, response }: { feedbackId: string; response: string },
    { rejectWithValue }
  ) => {
    try {
      return await feedbackService.respondToFeedback(feedbackId, response);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to respond to feedback");
    }
  }
);

export const fetchAllFeedback = createAsyncThunk<Feedback[], void, { rejectValue: string }>(
  "feedback/fetchAllFeedback",
  async (_, thunkAPI) => {
    try {
      const response = await feedbackService.fetchFeedback();
      return response; // Ensure the service returns data in the correct format
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch feedback.");
    }
  }
);

export const submitFeedback = createAsyncThunk(
  "feedback/submit",
  async (
    { orderId, rating, comment }: { orderId: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      return await feedbackService.submitFeedback(orderId, rating, comment);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit feedback");
    }
  }
);

export const fetchFeedbackByOrderId = createAsyncThunk(
  "feedback/fetchByOrderId",
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await feedbackService.fetchFeedbackByOrderId(orderId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch feedback for the order");
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  "feedback/delete",
  async (feedbackId: string, { rejectWithValue }) => {
    try {
      await feedbackService.deleteFeedback(feedbackId);
      return feedbackId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete feedback");
    }
  }
);

// Slice
const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Respond to Feedback
      .addCase(respondToFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToFeedback.fulfilled, (state, action: PayloadAction<Feedback>) => {
        const index = state.feedbackList.findIndex((fb) => fb.id === action.payload.id);
        if (index !== -1) {
          state.feedbackList[index] = action.payload; // Update the feedback with the response
        }
        state.loading = false;
      })
      .addCase(respondToFeedback.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
    builder
      // Fetch All Feedback
      .addCase(fetchAllFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFeedback.fulfilled, (state, action: PayloadAction<Feedback[]>) => {
        state.feedbackList = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllFeedback.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Submit Feedback
      .addCase(submitFeedback.fulfilled, (state, action: PayloadAction<Feedback>) => {
        state.feedbackList.push(action.payload);
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Fetch Feedback by Order ID
      .addCase(fetchFeedbackByOrderId.fulfilled, (state, action: PayloadAction<Feedback[]>) => {
        state.feedbackList = action.payload;
      })
      .addCase(fetchFeedbackByOrderId.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete Feedback
      .addCase(deleteFeedback.fulfilled, (state, action: PayloadAction<string>) => {
        state.feedbackList = state.feedbackList.filter((feedback) => feedback.id !== action.payload);
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const selectFeedback = (state: RootState) => state.feedback.feedbackList;
export default feedbackSlice.reducer;
