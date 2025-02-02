import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import cartService from "../../../services/cartService";
import { fetchProductDetails } from "../products/productSlice";
import type { AppDispatch } from "../../store";
import { Product } from "../../../types/Product";
import { CartItem } from "../../../types/cartItem";
import { validateDiscount } from "../../../utils/validationUtils";
import { ExchangeRate } from "../../../types/ExchangeRate";

// Updated `CartState` interface
interface CartState {
  cartList: CartItem[];
  escrowItems: CartItem[];
  totalSellerPrice: number;
  totalBuyerPrice: number;
  totalItems: number;
  discount: number;
  lockedExchangeRate: Record<string, number> | null;
  couponCode?: string;
  freeShippingThreshold: number | null;
  recommendations: CartItem[];
  loading: boolean;
  error: string | null;
  sellerCurrency?: string; // Nullable to ensure fallback to USD
  buyerCurrency?: string; // Nullable to ensure fallback
  exchangeRate: ExchangeRate[];
  currency: string;
}

// Initial state with default fallbacks
const initialState: CartState = {
  cartList: [],
  escrowItems: [],
  totalSellerPrice: 0,
  totalBuyerPrice: 0,
  totalItems: 0,
  discount: 0,
  lockedExchangeRate: null,
  couponCode: undefined,
  freeShippingThreshold: null,
  recommendations: [],
  loading: false,
  error: null,
  sellerCurrency: "USD", // Default fallback
  buyerCurrency: "EUR", // Default fallback
  exchangeRate: [],
  currency: '',
};

// Utility to get the default currency
const getBuyerCurrency = (state: CartState) => state.buyerCurrency || "USD";
const getSellerCurrency = (state: CartState) => state.sellerCurrency || "USD";


function calculateCartTotals(cartList: CartItem[]): {
  totalBuyerPrice: number;
  totalSellerPrice: number;
  totalItems: number;
} {
  let totalBuyerPrice = 0;
  let totalSellerPrice = 0;
  let totalItems = 0;

  cartList.forEach((item) => {
    totalBuyerPrice += item.buyerPrice * item.quantity;
    totalSellerPrice += item.sellerPrice * item.quantity;
    totalItems += item.quantity;
  });

  return {
    totalBuyerPrice,
    totalSellerPrice,
    totalItems,
  };
}

export interface FetchCartItemsResponse {
  cartItems: CartItem[];
  buyerCurrency?: string; // Optional in API response
  sellerCurrency?: string; // Optional in API response
}


// Async Thunks
export const fetchCartItems = createAsyncThunk<
  FetchCartItemsResponse,
  void,
  { state: { cart: CartState } }
>("cart/fetchCartItems", async (_, thunkAPI) => {
  try {
    return await cartService.fetchCartItems();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch cart items");
  }
});


export const convertPrices = createAsyncThunk(
  "cart/convertPrices",
  async (currency: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as { cart: CartState };
      const cartItems = state.cart.cartList;
      const conversionRates = await cartService.convertPrices(cartItems, currency);
      return conversionRates;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to convert prices");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }: { productId: string; quantity: number }, thunkAPI) => {
    try {
      return await cartService.updateCartItem(productId, quantity);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to update cart item");
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (productId: string, thunkAPI) => {
    try {
      return await cartService.removeItemFromCart(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to remove item from cart");
    }
  }
);

export const clearCart = createAsyncThunk("cart/clearCart", async (_, thunkAPI) => {
  try {
    return await cartService.clearCart();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to clear cart");
  }
});

export const fetchRecommendations = createAsyncThunk(
  "cart/fetchRecommendations",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { cart: CartState };
    try {
      return await cartService.fetchRecommendations(state.cart.cartList);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch recommendations");
    }
  }
);

export const fetchFreeShippingThreshold = createAsyncThunk(
  "cart/fetchFreeShippingThreshold",
  async (_, thunkAPI) => {
    try {
      return await cartService.fetchFreeShippingThreshold();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch free shipping threshold");
    }
  }
);

export const addItemToCart = (id: string, amount: number) => {
  return async (dispatch: AppDispatch) => {
    // Optimistic update
    dispatch(changeCartAmount({ id, amount }));

    try {
      const response = await dispatch(fetchProductDetails(id));

      if (fetchProductDetails.fulfilled.match(response)) {
        const product = response.payload as Product;

        dispatch(
          updateCartItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.imgUrl || "/assets/images/default-product.png", // Fallback for missing image
            stock: product.stock,
            quantity: amount,
          } as {
            productId: string;
            name: string;
            price: number;
            image: string;
            stock: number;
            quantity: number;
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };
};






// Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    lockExchangeRate(state, action: PayloadAction<Record<string, number>>) {
      state.lockedExchangeRate = action.payload;
    },
    // Changes to `changeCartAmount`
    changeCartAmount: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const { id, amount } = action.payload;
      const existingItem = state.cartList.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = Math.max(amount, 0);
      } else if (amount > 0) {
        state.cartList.push({
          productId: id,
          id,
          name: "Loading...",
          buyerPrice: 0,
          sellerPrice: 0,
          totalBuyerPrice: 0,
          totalSellerPrice: 0,
          buyerCurrency: getBuyerCurrency(state), // Fallback to default buyer currency
          sellerCurrency: getSellerCurrency(state), // Fallback to default seller currency
          image: "/assets/images/loading-placeholder.png",
          stock: 0,
          quantity: amount,
        });
      }

      const { totalBuyerPrice, totalSellerPrice, totalItems } = calculateCartTotals(
        state.cartList
      );
      state.totalBuyerPrice = totalBuyerPrice;
      state.totalSellerPrice = totalSellerPrice;
      state.totalItems = totalItems;
    },


    // Changes to `updateCartItem`
    updateCartItem: (
      state,
      action: PayloadAction<{
        productId: string;
        name: string;
        buyerPrice: number;
        sellerPrice: number;
        image: string;
        stock: number;
        quantity: number;
      }>
    ) => {
      const {
        productId,
        name,
        buyerPrice,
        sellerPrice,
        image,
        stock,
        quantity,
      } = action.payload;

      const existingItem = state.cartList.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.name = name;
        existingItem.buyerPrice = buyerPrice;
        existingItem.sellerPrice = sellerPrice;
        existingItem.totalBuyerPrice = buyerPrice * quantity;
        existingItem.totalSellerPrice = sellerPrice * quantity;
        existingItem.image = image;
        existingItem.stock = stock;
        existingItem.quantity = quantity;
      } else {
        state.cartList.push({
          productId,
          id: productId,
          name,
          buyerPrice,
          sellerPrice,
          totalBuyerPrice: buyerPrice * quantity,
          totalSellerPrice: sellerPrice * quantity,
          buyerCurrency: getBuyerCurrency(state), // Fallback to default buyer currency
          sellerCurrency: getSellerCurrency(state), // Fallback to default seller currency
          image,
          stock,
          quantity,
        });
      }

      const { totalBuyerPrice, totalSellerPrice, totalItems } = calculateCartTotals(
        state.cartList
      );
      state.totalBuyerPrice = totalBuyerPrice;
      state.totalSellerPrice = totalSellerPrice;
      state.totalItems = totalItems;
    },
    // Changes to `addItem`
    addItem: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.cartList.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + item.quantity,
          item.stock
        );
        existingItem.totalBuyerPrice =
          existingItem.buyerPrice * existingItem.quantity;
        existingItem.totalSellerPrice =
          existingItem.sellerPrice * existingItem.quantity;
      } else {
        state.cartList.push({
          ...item,
          totalBuyerPrice: item.buyerPrice * item.quantity,
          totalSellerPrice: item.sellerPrice * item.quantity,
          buyerCurrency: getBuyerCurrency(state), // Fallback to default buyer currency
          sellerCurrency: getSellerCurrency(state), // Fallback to default seller currency
          quantity: Math.min(item.quantity, item.stock),
        });
      }

      const { totalSellerPrice, totalBuyerPrice, totalItems } = calculateCartTotals(
        state.cartList
      );
      state.totalSellerPrice = totalSellerPrice;
      state.totalBuyerPrice = totalBuyerPrice;
      state.totalItems = totalItems;
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.cartList = state.cartList.filter((item) => item.id !== action.payload);
      const { totalSellerPrice, totalBuyerPrice, totalItems } = calculateCartTotals(state.cartList);
      state.totalSellerPrice = totalSellerPrice;
      state.totalBuyerPrice = totalBuyerPrice;
      state.totalItems = totalItems;
    },

    applyDiscount: (
      state,
      action: PayloadAction<{ discount: number }>
    ) => {
      const { discount } = action.payload;

      // Validate the discount percentage
      const validDiscount = validateDiscount(discount);

      // Apply the validated discount to totalBuyerPrice and totalSellerPrice
      state.discount = validDiscount;
      state.totalBuyerPrice = state.totalBuyerPrice * (1 - validDiscount / 100);
      state.totalSellerPrice = state.totalSellerPrice * (1 - validDiscount / 100);
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        const payload = action.payload;
        state.cartList = payload.cartItems;

        // Use fallback logic for buyerCurrency and sellerCurrency
        state.buyerCurrency = payload.buyerCurrency || getBuyerCurrency(state);
        state.sellerCurrency = payload.sellerCurrency || getSellerCurrency(state);

        const { totalSellerPrice, totalBuyerPrice, totalItems } = calculateCartTotals(
          state.cartList
        );
        state.totalSellerPrice = totalSellerPrice;
        state.totalBuyerPrice = totalBuyerPrice;
        state.totalItems = totalItems;

        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(convertPrices.fulfilled, (state, action) => {
        const conversionRates = action.payload;
        state.cartList.forEach((item) => {
          if (conversionRates[item.id]) {
            item.buyerPrice = conversionRates[item.id];
          }
        })
        const { totalBuyerPrice } = calculateCartTotals(state.cartList);
        state.totalBuyerPrice = totalBuyerPrice;
      })
      .addCase(fetchRecommendations.fulfilled, (state: CartState, action: PayloadAction<CartItem[]>) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchFreeShippingThreshold.fulfilled, (state: CartState, action: PayloadAction<number | null>) => {
        state.freeShippingThreshold = action.payload;
      })

  },

});




export const { changeCartAmount, removeItem, applyDiscount, lockExchangeRate } = cartSlice.actions;
export default cartSlice.reducer;
