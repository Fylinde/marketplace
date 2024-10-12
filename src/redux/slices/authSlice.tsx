import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../store';

// Define AuthState interface
interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define CompanyDetails interface
interface CompanyDetails {
  country?: string;
  companyType?: string;
  companyName?: string;
}

// Define ContactDetails interface
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

// Combine all states into a single slice
interface AppState extends AuthState {
  companyDetails: CompanyDetails;
  contactDetails: ContactDetails; // Add ContactDetails here
}

// Initial state for the combined slice
const initialState: AppState = {
  token: localStorage.getItem('token'),  // Initialize token from localStorage
  user: JSON.parse(localStorage.getItem('user') || 'null'),  // Initialize user from localStorage if available
  status: 'idle',
  error: null,
  companyDetails: {},
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

// Define User interface (update username to full_name)
interface User {
  id: number;
  full_name: string;  // Update to full_name
  email: string;
  // Add other user properties as needed
}

interface LoginPayload {
  access_token: string;
  refresh_token: string;
  session_token: string;
  user: User;
}

// Async thunk for login
export const login = createAsyncThunk<LoginPayload, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    console.log('Login thunk started with credentials:', credentials);

    try {
      const response = await axios.post(
        'http://localhost:8000/auth/login',
        new URLSearchParams({
          username: credentials.email,
          password: credentials.password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('Login API response:', response.data);

      const { access_token, refresh_token, session_token, user } = response.data;

      // Save the token and user in localStorage after login
      localStorage.setItem('token', access_token);  // Store the token in localStorage
      localStorage.setItem('user', JSON.stringify(user));  // Store the user object in localStorage

      return {
        access_token,
        refresh_token,
        session_token,
        user,
      };
    } catch (error) {
      console.error('Error during login process:', error);
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data) {
        console.error('Error response from server:', axiosError.response.data);
        return rejectWithValue(axiosError.response.data as string);
      } else {
        return rejectWithValue(axiosError.message);
      }
    }
  }
);

// Slice definition
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    saveCompanyDetails(state, action: PayloadAction<CompanyDetails>) {
      console.log('Saving company details:', action.payload);
      state.companyDetails = action.payload;
    },
    saveContactDetails(state, action: PayloadAction<ContactDetails>) {
      console.log('Saving contact details:', action.payload);
      state.contactDetails = action.payload;
    },
    logout(state) {
      console.log('User logged out');
      localStorage.removeItem('token');  // Remove token from localStorage on logout
      localStorage.removeItem('user');  // Remove user from localStorage on logout
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        console.log('Login process started...');
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginPayload>) => {
        console.log('Login fulfilled, payload:', action.payload);
        state.status = 'succeeded';
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.error('Login failed:', action.payload);
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { saveCompanyDetails, saveContactDetails, logout } = appSlice.actions;
export default appSlice.reducer;
