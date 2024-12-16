import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import userService from "../../../services/userService";
import type { AxiosError } from "axios";
import { WishlistItem } from "../orders/wishlistSlice";
import { getErrorMessage } from "../../../types/getErrorMessage";


// User roles and segments
export type UserRole = "buyer" | "seller" | "admin";
export type UserSegment = "B2C" | "B2B" | "C2C";

export interface UserProfile {
  id: string;
  buyerId: string; // Add buyerId here
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  segment: UserSegment;
}


export interface UserState {
  profile: UserProfile | null;
  wishlist: WishlistItem[];
  browsingHistory: string[]; // Array of product IDs
  cart: { productId: string; quantity: number }[]; // Array of cart items
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  currentSegment: UserSegment; // Add this line
}

const initialState: UserState = {
  profile: null,
  wishlist: [],
  browsingHistory: [],
  cart: [],
  isAuthenticated: false,
  loading: false,
  error: null,
  currentSegment: 'B2C',
};

export const fetchUserProfile = createAsyncThunk<
  UserProfile, // Return type
  void, // Argument type
  { rejectValue: string } // Rejected value type
>("user/fetchUserProfile", async (_, thunkAPI) => {
  try {
    const response = await userService.getUserProfile();
    return {
      ...response,
      buyerId: response.buyerId || "", // Add buyerId to the payload
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});




export const updateUserPreferences = createAsyncThunk<
  UserProfile, // Return type
  { segment: UserSegment }, // Argument type
  { rejectValue: string } // Rejected value type
>("user/updateUserPreferences", async (preferences, thunkAPI) => {
  try {
    const response = await userService.updatePreferences(preferences);
    return response;
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if ((error as AxiosError).response) {
      errorMessage = (error as AxiosError).response?.data?.message || (error as AxiosError).message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});


export const addToWishlist = createAsyncThunk<
  WishlistItem[], // Return type
  string, // Argument type (productId)
  { rejectValue: string } // Rejected value type
>("user/addToWishlist", async (productId, thunkAPI) => {
  try {
    const response = await userService.addProductToWishlist(productId);
    return response;
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if ((error as AxiosError).response) {
      errorMessage = (error as AxiosError).response?.data?.message || (error as AxiosError).message;

    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});


export const removeFromWishlist = createAsyncThunk<
  WishlistItem[], // Return type
  string, // Argument type (productId)
  { rejectValue: string } // Rejected value type
>("user/removeFromWishlist", async (productId, thunkAPI) => {
  try {
    const response = await userService.removeProductFromWishlist(productId);
    return response;
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if ((error as AxiosError).response) {
      errorMessage = (error as AxiosError).response?.data?.message || (error as AxiosError).message;

    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});



export const addToCart = createAsyncThunk<
  { productId: string; quantity: number }[], // Return type
  { productId: string; quantity: number }, // Argument type
  { rejectValue: string } // Rejected value type
>("user/addToCart", async ({ productId, quantity }, thunkAPI) => {
  try {
    const response = await userService.addProductToCart(productId, quantity);
    return response;
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if ((error as AxiosError).response) {
      errorMessage = (error as AxiosError).response?.data?.message || (error as AxiosError).message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});


export const fetchBrowsingHistory = createAsyncThunk<
  string[], // Return type
  void, // Argument type
  { rejectValue: string } // Rejected value type
>("user/fetchBrowsingHistory", async (_, thunkAPI) => {
  try {
    const response = await userService.getBrowsingHistory();
    return response;
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if ((error as AxiosError).response) {
      errorMessage = (error as AxiosError).response?.data?.message || (error as AxiosError).message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.wishlist = [];
      state.cart = [];
      state.browsingHistory = [];
      state.currentSegment = "B2C";
    },
    setCurrentSegment: (state, action: PayloadAction<UserSegment>) => {
      state.currentSegment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload; // TypeScript now knows `action.payload` is `UserProfile`
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Preferences
    builder
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.segment = action.payload.segment;
        }
      });

    // Wishlist
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload; // TypeScript knows `action.payload` is `WishlistItem[]`
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      });

    // Cart
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.cart = action.payload;
    });

    // Browsing History
    builder.addCase(fetchBrowsingHistory.fulfilled, (state, action) => {
      state.browsingHistory = action.payload;
    });
  },
});

// Selectors
export const selectCurrentSegment = (state: RootState) => state.user.currentSegment;
export const selectUserId = (state: RootState): string | null => state.user.profile?.id || null;

// Export actions and reducer
export const { logout, setCurrentSegment } = userSlice.actions;
export default userSlice.reducer;
