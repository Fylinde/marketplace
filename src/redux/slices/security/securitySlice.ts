import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import securityService from "../../../services/securityService";

// Types
interface FailedLoginAttempt {
  ipAddress: string;
  timestamp: string;
}

interface SecurityState {
  twoFactorEnabled: boolean;
  accessControlList: Array<{ userId: string; userName: string; role: string; status: boolean }>;
  failedLoginAttempts: FailedLoginAttempt[];
  loading: boolean;
  error: string | null;
}

const initialState: SecurityState = {
  twoFactorEnabled: false,
  accessControlList: [],
  failedLoginAttempts: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTwoFactorStatus = createAsyncThunk<
  { enabled: boolean },
  string,
  { rejectValue: string }
>("security/fetchTwoFactorStatus", async (userId, thunkAPI) => {
  try {
    return await securityService.fetchTwoFactorStatus(userId);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to fetch 2FA status");
  }
});

export const enableTwoFactor = createAsyncThunk<
  { success: boolean },
  string,
  { rejectValue: string }
>("security/enableTwoFactor", async (userId, thunkAPI) => {
  try {
    return await securityService.enableTwoFactor(userId);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to enable 2FA");
  }
});

export const verifyTwoFactor = createAsyncThunk<
  { verified: boolean }, // Success payload type
  { userId: string; token: string }, // Argument type
  { rejectValue: string } // Reject value type
>("security/verifyTwoFactor", async ({ userId, token }, thunkAPI) => {
  try {
    return await securityService.verifyTwoFactor(userId, token); // Now returns { verified: boolean }
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to verify two-factor authentication code.");
  }
});


export const fetchAccessControlList = createAsyncThunk<
  Array<{ userId: string; userName: string; role: string; status: boolean }>,
  void,
  { rejectValue: string }
>("security/fetchAccessControlList", async (_, thunkAPI) => {
  try {
    return await securityService.fetchAccessControlList();
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch access control list.");
  }
});

export const updateAccessStatus = createAsyncThunk<
  { success: boolean },
  { userId: string; status: boolean },
  { rejectValue: string }
>("security/updateAccessStatus", async ({ userId, status }, thunkAPI) => {
  try {
    return await securityService.updateAccessStatus(userId, status);
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to update access status.");
  }
});

export const fetchFailedLoginAttempts = createAsyncThunk<
  FailedLoginAttempt[],
  string,
  { rejectValue: string }
>("security/fetchFailedLoginAttempts", async (userId, thunkAPI) => {
  try {
    return await securityService.fetchFailedLoginAttempts(userId);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to fetch login attempts");
  }
});

export const blockIp = createAsyncThunk<
  { success: boolean },
  { ipAddress: string },
  { rejectValue: string }
>("security/blockIp", async ({ ipAddress }, thunkAPI) => {
  try {
    return await securityService.blockIp(ipAddress);
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to block IP address.");
  }
});

export const whitelistIp = createAsyncThunk<
  { success: boolean },
  { ipAddress: string },
  { rejectValue: string }
>("security/whitelistIp", async ({ ipAddress }, thunkAPI) => {
  try {
    return await securityService.whitelistIp(ipAddress);
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to whitelist IP address.");
  }
});

export const sendSecurityAlerts = createAsyncThunk<
  { success: boolean },
  { userId: string; alertDetails: { type: string; message: string } },
  { rejectValue: string }
>("security/sendSecurityAlerts", async ({ userId, alertDetails }, thunkAPI) => {
  try {
    return await securityService.sendSecurityAlerts(userId, alertDetails);
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to send security alerts.");
  }
});

// Security slice
const securitySlice = createSlice({
  name: "security",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Two-Factor Authentication
      .addCase(fetchTwoFactorStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTwoFactorStatus.fulfilled, (state, action: PayloadAction<{ enabled: boolean }>) => {
        state.loading = false;
        state.twoFactorEnabled = action.payload.enabled;
      })
      .addCase(fetchTwoFactorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred while fetching 2FA status";
      })
      // Enable Two-Factor
      .addCase(enableTwoFactor.fulfilled, (state) => {
        state.twoFactorEnabled = true;
        state.loading = false;
      })
      .addCase(enableTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to enable two-factor authentication";
      })
      // Failed Login Attempts
      .addCase(fetchFailedLoginAttempts.fulfilled, (state, action: PayloadAction<FailedLoginAttempt[]>) => {
        state.failedLoginAttempts = action.payload;
        state.loading = false;
      })
      .addCase(fetchFailedLoginAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch login attempts";
      })
      // Add Matchers for Pending and Rejected
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = (action as PayloadAction<string>).payload || "An error occurred";
        }
      );
  },
});

export default securitySlice.reducer;
