import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import sellerRegistrationService from "../../../services/sellerRegistrationService";
import axios from "axios";

// Import types
import { AccountDetails, SellerVerification } from "../../../types/sharedTypes";

// Define types for Redux state
interface SellerRegistrationState {
    step: number;
    accountDetails: AccountDetails;
    verification: SellerVerification;
    loading: boolean;
    error: string | null;
    success: boolean;
}

// Initial state
const initialState: SellerRegistrationState = {
    step: 1,
    accountDetails: {
        full_name: "",
        email: "",
        phoneNumber: "",
        password: "",
    },
    verification: {
        emailOrPhone: "",
        verificationCode: "",
        isVerified: false,
        verificationStatus: "pending",
        verificationError: null,
        expirationTime: null,
    },
    loading: false,
    error: null,
    success: false,
};

// Async action for submitting the account creation step
export const submitAccountCreation = createAsyncThunk(
    "seller/registerAccount",
    async (accountData: AccountDetails, thunkAPI) => {
        try {
            return await sellerRegistrationService.registerAccount(accountData);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
            }
            return thunkAPI.rejectWithValue("An unknown error occurred");
        }
    }
);

// Async action for sending verification code
export const sendVerificationCode = createAsyncThunk(
    "seller/sendVerificationCode",
    async (emailOrPhone: string, thunkAPI) => {
        try {
            return await sellerRegistrationService.sendVerification(emailOrPhone);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
            }
            return thunkAPI.rejectWithValue("An unknown error occurred");
        }
    }
);

// Async action for verifying OTP
export const verifyOTP = createAsyncThunk(
    "seller/verifyOTP",
    async ({ emailOrPhone, verificationCode }: { emailOrPhone: string; verificationCode: string }, thunkAPI) => {
        try {
            return await sellerRegistrationService.verifyOTP(emailOrPhone, verificationCode);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data || "Invalid OTP");
            }
            return thunkAPI.rejectWithValue("Verification failed");
        }
    }
);


const sellerRegistrationSlice = createSlice({
    name: "sellerRegistration",
    initialState,
    reducers: {
        nextStep: (state) => {
            state.step += 1;
        },
        prevStep: (state) => {
            state.step -= 1;
        },
        updateAccountDetails: (state, action: PayloadAction<Partial<AccountDetails>>) => {
            state.accountDetails = { ...state.accountDetails, ...action.payload };
        },
        updateVerification: (state, action: PayloadAction<Partial<SellerVerification>>) => {
            state.verification = { ...state.verification, ...action.payload };
        },
        resetRegistration: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitAccountCreation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitAccountCreation.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitAccountCreation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
            builder
            .addCase(sendVerificationCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendVerificationCode.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(sendVerificationCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state) => {
                state.loading = false;
                state.verification.isVerified = true;
                state.nextStep();
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { nextStep, prevStep, updateAccountDetails, updateVerification, resetRegistration } =
    sellerRegistrationSlice.actions;
export default sellerRegistrationSlice.reducer;
