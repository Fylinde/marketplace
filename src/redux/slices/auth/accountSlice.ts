import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import accountService from '../../../services/accountService';
import { RootState } from '../../store';
import { User } from '../../../types/sharedTypes';

// Interfaces for types
interface Credentials {
  email: string;
  password: string;
}

interface AccountState {
  user: User | null; // Replace `User` with the actual user type
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  activityLog: any[]; // Replace `any` with proper type if available
  notifications: any[]; // Replace `any` with proper type if available
  preferences: {
    language: string;
    theme: string;
  };
  data: any | null; // Add `data` to store account info
  loading: boolean; // Add `loading` to indicate API call status
}

const initialState: AccountState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  activityLog: [],
  notifications: [],
  preferences: {
    language: 'en',
    theme: 'light',
  },
  data: null, // Initialize `data` as null
  loading: false, // Initialize `loading` as false
};


// Async Thunks
export const login = createAsyncThunk(
  'account/login',
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      const response = await accountService.login(credentials);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'account/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.account.token;

    if (!token) {
      return rejectWithValue('Token is missing');
    }

    try {
      const response = await accountService.getProfile(token);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch user profile');
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  'account/updateUserProfile',
  async (profileData: any, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.account.token;

    if (!token) {
      throw new Error('Token is required to update user profile');
    }

    try {
      const response = await accountService.updateProfile(profileData, token);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Update profile failed');
    }
  }
);

// Async Thunk for fetching account info
export const fetchAccountInfo = createAsyncThunk(
  'account/fetchAccountInfo',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.account.token;

    if (!token) {
      return rejectWithValue('Token is missing');
    }

    try {
      const response = await accountService.fetchAccountInfo(token);
      return response.data; // Assume the API returns account info
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch account info');
    }
  }
);

export const updateAccountInfo = createAsyncThunk(
  'account/updateAccountInfo',
  async (accountData: any, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.account.token;

    if (!token) {
      return rejectWithValue('Token is missing');
    }

    try {
      const response = await accountService.updateAccountInfo(accountData, token);
      return response.data; // Assume the API returns updated account info
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update account info');
    }
  }
);


// Slice
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
    },
    updatePreferences(state, action) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAccountInfo
      .addCase(fetchAccountInfo.pending, (state) => {
        state.loading = true; // Set loading to true while fetching
        state.error = null;
      })
      .addCase(fetchAccountInfo.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false after success
        state.data = action.payload; // Store the fetched account info
      })
      .addCase(fetchAccountInfo.rejected, (state, action) => {
        state.loading = false; // Set loading to false after failure
        state.error = action.payload as string;
      });

    builder

      // Handle updateAccountInfo
      .addCase(updateAccountInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAccountInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload }; // Merge updated info
      })
      .addCase(updateAccountInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  },
});

export const { logout, updatePreferences, clearError } = accountSlice.actions;
export default accountSlice.reducer;
