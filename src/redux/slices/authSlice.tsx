
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../store';
// Ensure User is defined
interface User {
  id: number;
  full_name: string;
  email: string;
}

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
}

// Define the message type returned by the login thunk
interface LoginMessagePayload {
  message: string;
}

interface CompanyDetails {
  country?: string;
  companyType?: string;
  companyName?: string;
}

interface ContactDetails {
  firstName: string;
  middleName?: string;
  lastName: string;
  countryOfCitizenship: string;
  countryOfResidence: string;
  residentialAddress: string;
  postalCode: string;
  building: string;
  state: string;
  phoneNumber: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
}

interface AppState {
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  otpSent: boolean; // Flag for OTP flow
  companyDetails: CompanyDetails;
  contactDetails: ContactDetails;
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


// Define initial state with safe JSON parsing for user
const initialState: AppState = {
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
  status: 'idle',
  error: null,
  otpSent: false, // Initialize OTP flag as false
  companyDetails: {}, // Empty object for companyDetails
  contactDetails: {
    firstName: '',
    lastName: '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    residentialAddress: '',
    postalCode: '',
    building: '',
    state: '',
    phoneNumber: '',
    dateOfBirth: {
      day: '',
      month: '',
      year: '',
    },
  },
};

// Async thunk for handling login with credentials
export const login = createAsyncThunk<
LoginMessagePayload,
  { emailOrPhone: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(
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

    const { message } = response.data;

    return { message };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Use optional chaining and a fallback message
    const errorDetail = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'detail' in axiosError.response.data
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
    const response = await axios.post(
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
      state.status = 'idle';
      state.error = null;
    },
    saveCompanyDetails(state, action: PayloadAction<CompanyDetails>) {
      state.companyDetails = action.payload;
    },
    saveContactDetails(state, action: PayloadAction<ContactDetails>) {
      state.contactDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
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
export const { setAuthData, loadAuthData, logout, saveCompanyDetails, saveContactDetails } = authSlice.actions;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.access_token;
export default authSlice.reducer;
