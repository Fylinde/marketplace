import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import sellerRegistrationService from "../../../services/sellerRegistrationService";
import { getSellerCurrentStep } from "../../../services/sellerRegistrationService"; // ✅ Import API call
import axios from "axios";

// Import types
import { AccountDetails, SellerVerification } from "../../../types/sharedTypes";

// Define types for Redux state
interface SellerRegistrationState {
    step: number;
    sellerId: null, // Track the seller ID
    accountDetails: AccountDetails |null;
    verification: SellerVerification; // ✅ Keep all verification-related fields inside this object
    loading: boolean;
    error: string | null;
    success: boolean;
}


// Initial state
const initialState: SellerRegistrationState = {
    step: 1,
    sellerId: null, // Track the seller ID
    accountDetails: {
        full_name: "",
        email: "",
        phoneNumber: "",
        password: "",
        seller_type: "individual",  // ✅ Must be "individual" or "professional"
        currency_code: "USD",         // ✅ Required
        is_email_verified: false,     // ✅ Required (defaults to False)
        is_phone_verified: false,     // ✅ Required (defaults to False)
        profile_picture: null,        // ✅ Optional but explicitly sent as null
        preferences: null,            // ✅ Optional but explicitly sent as null
        verification_code: null,      // ✅ Optional but explicitly sent as null
        verification_expiration: null //
    },
    verification: {
        emailOrPhone: "",
        email: "",
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
            const response = await sellerRegistrationService.registerAccount(accountData);
            
            // ✅ Save sellerId in Redux for later use
            thunkAPI.dispatch(setSellerId(response.sellerId));

            // ✅ Add a slight delay before fetching the step (database consistency)
            setTimeout(() => {
                thunkAPI.dispatch(fetchCurrentStep(response.sellerId));
            }, 2000);  // ⏳ Delay of 2 seconds to ensure database is updated
            
            return response;
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

export const resendOTP = createAsyncThunk(
    "seller/resendOTP",
    async (emailOrPhone: string, thunkAPI) => {
        try {
            return await sellerRegistrationService.sendVerification(emailOrPhone);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
            }
            return thunkAPI.rejectWithValue("Failed to resend OTP");
        }
    }
);

// ✅ Fetch the seller's current step and update Redux store
export const fetchCurrentStep = createAsyncThunk(
    "seller/fetchCurrentStep",
    async (sellerId: string, thunkAPI) => {
      const step = await getSellerCurrentStep(sellerId);
      return step; // ✅ This updates Redux state
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
        updateVerification: (state, action: PayloadAction<Partial<SellerVerification>>) => {
            state.verification = { ...state.verification, ...action.payload };
        },
        resetRegistration: () => initialState,
        setEmailOrPhone: (state, action: PayloadAction<string>) => {
            state.verification.emailOrPhone = action.payload;

        },
        resetVerification: () => initialState,
        setVerificationError: (state, action: PayloadAction<string | null>) => {
            if (!state.verification) {
                state.verification = {  // ✅ Ensure verification object exists
                    emailOrPhone: "",
                    verificationCode: "",
                    isVerified: false,
                    verificationStatus: "pending",
                    verificationError: null,
                    expirationTime: null,
                };
            }
            state.verification.verificationError = action.payload;  // ✅ Assign error
        },
        updateStep(state, action: PayloadAction<number>) {
            state.step = action.payload;
        },
        updateAccountDetails(state, action: PayloadAction<AccountDetails>) {
            state.accountDetails = action.payload;
        },
        resetRegistrationState(state) {  
            state.step = 1;  // ✅ Reset step to 1 after deletion
            state.sellerId = null;
            state.accountDetails = null;
        },
        setSellerId: (state, action) => {
            state.sellerId = action.payload;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitAccountCreation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitAccountCreation.fulfilled, (state) => {
                state.step = 2;  // ✅ Explicitly set step = 2
            })
            .addCase(submitAccountCreation.rejected, (state) => {
                state.step = 1; // Stay on step 1 if registration fails
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
            builder
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.verification.verificationError = null;
            })
            .addCase(verifyOTP.fulfilled, (state) => {
                state.loading = false;
                state.verification.isVerified = true;
                state.verification.verificationStatus = "success";
                
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                if (!state.verification) {
                    state.verification = {  // ✅ Ensure verification object exists
                        emailOrPhone: "",
                        verificationCode: "",
                        isVerified: false,
                        verificationStatus: "pending",
                        verificationError: null,
                        expirationTime: null,
                    };
                }
                state.verification.verificationError = action.payload as string;
            })
            .addCase(resendOTP.pending, (state) => {
                state.loading = true;
            })
            .addCase(resendOTP.fulfilled, (state) => {
                state.loading = false;
                state.verification.verificationStatus = "pending";
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.loading = false;
                state.verification.verificationError = action.payload as string;
            });
        builder
            .addCase(fetchCurrentStep.fulfilled, (state, action) => {
                state.step = action.payload; // ✅ Update step from backend
              });
    },
});

export const {
    nextStep,
    prevStep,
    updateAccountDetails,
    updateVerification,
    resetRegistration,
    setEmailOrPhone,
    resetVerification,
    resetRegistrationState,
    setSellerId,
} =
    sellerRegistrationSlice.actions;
export default sellerRegistrationSlice.reducer;
