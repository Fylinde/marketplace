import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../types/Product";
import axios from "axios";

// Define Wishlist Item Interface
export interface WishlistItem extends Product {
  note?: string; // User-specific note for the item
  category?: string; // Custom category for organization
}

// Define Wishlist State Interface
interface WishlistState {
  items: WishlistItem[];
  recommendations: Product[]; // Personalized recommendations
  sharedWith: string[]; // List of users the wishlist is shared with
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: WishlistState = {
  items: [],
  recommendations: [],
  sharedWith: [],
  loading: false,
  error: null,
};

// Fetch Wishlist Items
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/wishlist");
      return response.data as WishlistItem[];
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch wishlist");
    }
  }
);

// Add Item to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (item: WishlistItem, thunkAPI) => {
    try {
      const response = await axios.post("/api/wishlist", item);
      return response.data as WishlistItem;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to add item to wishlist");
    }
  }
);

// Remove Item from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (itemId: string, thunkAPI) => {
    try {
      await axios.delete(`/api/wishlist/${itemId}`);
      return itemId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to remove item from wishlist");
    }
  }
);

// Fetch Recommendations for Wishlist
export const fetchRecommendations = createAsyncThunk(
  "wishlist/fetchRecommendations",
  async (wishlistItems: WishlistItem[], thunkAPI) => {
    try {
      const response = await axios.post("/api/wishlist/recommendations", { items: wishlistItems });
      return response.data as Product[];
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch recommendations");
    }
  }
);

// Share Wishlist with Other Users
export const shareWishlist = createAsyncThunk(
  "wishlist/shareWishlist",
  async (emails: string[], thunkAPI) => {
    try {
      await axios.post("/api/wishlist/share", { emails });
      return emails;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to share wishlist");
    }
  }
);

// Wishlist Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add to Wishlist
    builder
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistItem>) => {
        state.items.push(action.payload);
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });

    // Fetch Recommendations
    builder
      .addCase(fetchRecommendations.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.recommendations = action.payload;
      });

    // Share Wishlist
    builder
      .addCase(shareWishlist.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.sharedWith = action.payload;
      });
  },
});

// Export Reducer and Actions
export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
