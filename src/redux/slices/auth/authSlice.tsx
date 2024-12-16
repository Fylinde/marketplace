import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../utils/axiosSetup";
import { RootState } from '../../store';
import { AxiosError } from 'axios';
import authService from '../../../services/authService';
// Interfaces
interface User {
  id: number;
  userId: string | null; // Ensure userId is part of the state
  isAuthenticated: boolean;
  full_name: string;
  email: string;
  role: string; // Add role to the User interface
}

interface AuthState {
  userId: string | null; // Ensure userId is part of the state
  isAuthenticated: boolean;
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
  role: string | null;
  isTwoFactorEnabled: boolean;
  loading: boolean;
  error: string | null;
}

interface AppState extends AuthState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  otpSent: boolean; // Flag for OTP flow
}

interface LoginMessagePayload {
  message: string;
}

interface LoginPayload {
  access_token: string;
  refresh_token: string;
  session_token?: string;
  user: User;
}

interface AuthDataPayload {
  access_token: string;
  refresh_token: string;
  user: User | null;
}

// Cleanup: Remove any "undefined" strings from localStorage
if (localStorage.getItem('user') === 'undefined') {
  localStorage.removeItem('user');
}

// Initial State
const initialState: AppState = {
  userId: null, // Default value for userId
  isAuthenticated: false,
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
  user: (() => {
    try {
      const userData = localStorage.getItem('user');
      return userData && userData !== 'undefined' && userData !== '' ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  })(),
  isTwoFactorEnabled: false,
  loading: false,
  status: 'idle',
  error: null,
  otpSent: false,
  role: null,
};


// authSlice.ts

// Async thunk for enabling Two-Factor Authentication
export const enableTwoFactor = createAsyncThunk<void, { userId: string }>(
  "auth/enableTwoFactor",
  async ({ userId }, { rejectWithValue }) => {
    try {
      await api.post("/auth/enable-2fa", { userId });
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to enable Two-Factor Authentication."
      );
    }
  }
);

// Async thunk for verifying Two-Factor Authentication
export const verifyTwoFactor = createAsyncThunk<void, { userId: string; token: string }>(
  "auth/verifyTwoFactor",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      await api.post("/auth/verify-2fa", { userId, token });
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data?.message || "Invalid Two-Factor Authentication code."
      );
    }
  }
);


export const login = createAsyncThunk<
  { message: string; access_token: string; refresh_token: string; user: { id: number; full_name: string; email: string; role: string } },
  { emailOrPhone: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(
      'http://localhost:8000/auth/login',
      new URLSearchParams({
        username: credentials.emailOrPhone,
        password: credentials.password,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    console.log("Login response data:", response.data);

    const { message, access_token, refresh_token, ...user } = response.data;

    // Derive the role based on is_admin
    const role = user.is_admin ? "admin" : "user";

    const userWithRole = {
      ...user,
      role,
    };

    return { message, access_token, refresh_token, user: userWithRole };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Use optional chaining and a fallback message
    const errorDetail =
      axiosError.response?.data &&
        typeof axiosError.response.data === 'object' &&
        'detail' in axiosError.response.data
        ? (axiosError.response.data as { detail: string }).detail
        : 'Login failed.';

    return rejectWithValue(errorDetail);
  }
});

export const selectUserFullName = (state: RootState) => state.auth.user?.full_name || "Guest";
// Async thunk for OTP verification
// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk<
  LoginPayload,
  { contact: string; otp: string },
  { rejectValue: string }
>('auth/verifyOtp', async ({ contact, otp }, { rejectWithValue }) => {
  try {
    // Use JSON payload for consistency
    const response = await api.post(
      'http://localhost:8000/auth/verify-otp',
      { contact, otp },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Assume the response contains the full user data
    const { access_token, refresh_token, user } = response.data;

    // Check if user data is present, if not, add a fallback
    const userData: User = user || {
      id: Number(contact),
      full_name: 'Unknown',
      email: 'unknown@example.com'
    };

    return {
      access_token,
      refresh_token,
      user: userData,
      session_token: undefined
    };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Safely access detail property with fallback
    const errorDetail = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'detail' in axiosError.response.data
      ? (axiosError.response.data as { detail: string }).detail
      : 'OTP verification failed.';

    return rejectWithValue(errorDetail);
  }
});

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      // Replace this with an actual API call
      const response = await fetch("/api/auth/user");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);


// Create the auth slice with reducers and async thunk cases
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<AuthDataPayload>) {
      const { access_token, refresh_token, user } = action.payload;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.user = user;
      state.userId = null;
      state.isAuthenticated = false;
      state.role = user?.role || null;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    loadAuthData(state) {
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user');

      state.access_token = storedAccessToken;
      state.refresh_token = storedRefreshToken;
      state.user = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;

    },
    logout(state) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      state.access_token = null;
      state.refresh_token = null;
      state.user = null;
      state.role = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<{ userId: string }>) => {
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    });
    builder
      // Enable Two-Factor Authentication
      .addCase(enableTwoFactor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enableTwoFactor.fulfilled, (state) => {
        state.loading = false;
        state.isTwoFactorEnabled = true;
      })
      .addCase(enableTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Two-Factor Authentication
      .addCase(verifyTwoFactor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTwoFactor.fulfilled, (state) => {
        state.loading = false;
        // Handle successful verification (e.g., update user session state if needed)
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.otpSent = false;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginMessagePayload>) => {
        state.status = 'succeeded';
        state.otpSent = true; // OTP has been sent, proceed to OTP entry
        console.log(action.payload.message); // Log the OTP sent message
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.otpSent = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<LoginPayload>) => {
        state.status = 'succeeded';
        const { access_token, refresh_token, user } = action.payload;
        state.access_token = access_token;
        state.refresh_token = refresh_token;
        state.user = user;
        state.error = null;
        state.otpSent = false; // Reset OTP flag after verification

        // Persist to localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.otpSent = true; // Stay in OTP flow if verification fails
      });
  },
});

// Export actions and the reducer
export const { setAuthData, loadAuthData, logout } = authSlice.actions;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.access_token;
export default authSlice.reducer;
