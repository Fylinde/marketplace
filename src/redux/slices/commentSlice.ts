import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Utility to extract error message
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Define the ReviewComment interface
export interface ReviewComment {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

// Define the CommentState interface
interface CommentState {
  comments: ReviewComment[];
  loading: boolean;
  error: string | null;
}

// Initial state for comments
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// Fetch comments for a product
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (productId: string, thunkAPI) => {
    try {
      const response = await axios.get(`/api/products/${productId}/comments`);
      return response.data as ReviewComment[];
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Add a new comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async (
    { productId, rating, comment }: { productId: string; rating: number; comment: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`/api/products/${productId}/comments`, {
        rating,
        comment,
      });
      return response.data as ReviewComment;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Comment slice definition
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<ReviewComment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle addComment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<ReviewComment>) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default commentSlice.reducer;
