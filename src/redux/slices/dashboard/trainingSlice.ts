import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trainingService from '../../../services/trainingService';

interface TrainingState {
  recommendedCourses: any[];
  enrolledCourses: any[];
  courseDetails: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrainingState = {
  recommendedCourses: [],
  enrolledCourses: [],
  courseDetails: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchRecommendedCourses = createAsyncThunk(
  'training/fetchRecommendedCourses',
  async (_, { rejectWithValue }) => {
    try {
      return await trainingService.getRecommendedCourses();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  'training/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      return await trainingService.getEnrolledCourses();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'training/enrollInCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      return await trainingService.enrollInCourse(courseId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseDetails = createAsyncThunk(
  'training/fetchCourseDetails',
  async (courseId: number, { rejectWithValue }) => {
    try {
      return await trainingService.fetchCourseDetails(courseId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedCourses.fulfilled, (state, { payload }) => {
        state.recommendedCourses = payload;
        state.loading = false;
      })
      .addCase(fetchRecommendedCourses.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      })
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, { payload }) => {
        state.enrolledCourses = payload;
        state.loading = false;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      })
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, { payload }) => {
        state.courseDetails = payload;
        state.loading = false;
      })
      .addCase(fetchCourseDetails.rejected, (state, { payload }) => {
        state.error = payload as string;
        state.loading = false;
      });
  },
});

export default trainingSlice.reducer;
