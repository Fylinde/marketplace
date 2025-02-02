import { createSlice, PayloadAction, Draft } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import checkoutService from "../../../services/checkoutService";
import { Address } from "../../../types/address";
import { validateDiscount } from "../../../utils/validationUtils";
import { CartItem } from "../../../types/cartItem";
import { DeliveryOption } from "../../../types/order";

export interface PaymentMethod {
  cardType: string;
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
}


export interface CheckoutState {
  currentStep: number; // Tracks the current step of the checkout process
  shippingAddress: Address | null;
  billingAddress: Address | null;
  paymentMethod: PaymentMethod | null;
  cartItems: CartItem[];
  deliveryOption: DeliveryOption | null;
  totalSellerPrice: number; // Total price in seller's currency
  totalBuyerPrice: number; // Total price in buyer's currenc
  discount: number;
  couponCode?: string;
  countryList: { label: string; value: string }[];
  error: string | null;
  currency: string; // Add this line
  buyerCurrency: string;
  sellerCurrency: string;
}

const initialState: CheckoutState = {
  currentStep: 0,
  shippingAddress: null,
  billingAddress: null,
  paymentMethod: null,
  cartItems: [],
  deliveryOption: null,
  totalSellerPrice: 0,
  totalBuyerPrice: 0,
  discount: 0,
  countryList: [],
  error: null,
  currency: '',
  buyerCurrency: '',
  sellerCurrency: '',
};

// Utility Function to Calculate Totals
const calculateCartTotals = (
  items: CartItem[],
  discount: number,
  deliveryPrice: number
): { totalSellerPrice: number; totalBuyerPrice: number } => {
  const sellerPrice = items.reduce((sum, item) => sum + item.sellerPrice * item.quantity, 0);
  const buyerPrice = items.reduce((sum, item) => sum + item.buyerPrice * item.quantity, 0);
  return {
    totalSellerPrice: sellerPrice + deliveryPrice - discount,
    totalBuyerPrice: buyerPrice + deliveryPrice - discount,
  };
};

// Async Thunks
export const fetchCountryList = createAsyncThunk(
  "checkout/fetchCountryList",
  async (_, thunkAPI) => {
    try {
      return await checkoutService.getCountryList();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch country list");
    }
  }
);

export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { checkout: CheckoutState };
    try {
      return await checkoutService.submitOrder(state.checkout);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to place order");
    }
  }
);

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingAddress(state: Draft<CheckoutState>, action: PayloadAction<Address>) {
      state.shippingAddress = action.payload;
    },
    setBillingAddress(state: Draft<CheckoutState>, action: PayloadAction<Address>) {
      state.billingAddress = action.payload;
    },
    setPaymentMethod(state: Draft<CheckoutState>, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload;
    },
    addCartItem(state: Draft<CheckoutState>, action: PayloadAction<CartItem>) {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
      const deliveryPrice = state.deliveryOption ? state.deliveryOption.price : 0;
      const { totalSellerPrice, totalBuyerPrice } = calculateCartTotals(
        state.cartItems,
        state.discount,
        deliveryPrice
      );
      state.totalSellerPrice = totalSellerPrice;
      state.totalBuyerPrice = totalBuyerPrice;
    },
    removeCartItem(state: Draft<CheckoutState>, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      const deliveryPrice = state.deliveryOption ? state.deliveryOption.price : 0;
      const { totalSellerPrice, totalBuyerPrice } = calculateCartTotals(
        state.cartItems,
        state.discount,
        deliveryPrice
      );
      state.totalSellerPrice = totalSellerPrice;
      state.totalBuyerPrice = totalBuyerPrice;
    },
    setDeliveryOption(state: Draft<CheckoutState>, action: PayloadAction<DeliveryOption>) {
      state.deliveryOption = action.payload;
      const { totalSellerPrice, totalBuyerPrice } = calculateCartTotals(
        state.cartItems,
        state.discount,
        action.payload.price
      );
      state.totalSellerPrice = totalSellerPrice;
      state.totalBuyerPrice = totalBuyerPrice;
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

    updateTotalAmount(state: Draft<CheckoutState>) {
      const itemsTotals = state.cartItems.reduce(
        (totals, item) => {
          const buyerPrice = item.buyerPrice * item.quantity;
          const sellerPrice = item.sellerPrice * item.quantity;
          return {
            totalBuyerPrice: totals.totalBuyerPrice + buyerPrice,
            totalSellerPrice: totals.totalSellerPrice + sellerPrice,
          };
        },
        { totalBuyerPrice: 0, totalSellerPrice: 0 }
      );

      const deliveryFee = state.deliveryOption ? state.deliveryOption.price : 0;

      state.totalBuyerPrice =
        itemsTotals.totalBuyerPrice + deliveryFee - state.discount;

      state.totalSellerPrice = itemsTotals.totalSellerPrice;
    },


    clearCheckout(state: Draft<CheckoutState>) {
      state.shippingAddress = null;
      state.billingAddress = null;
      state.paymentMethod = null;
      state.cartItems = [];
      state.deliveryOption = null;
      state.totalSellerPrice = 0;
      state.totalBuyerPrice = 0;
      state.discount = 0;
      state.currentStep = 0;
    },
    setCurrentStep(state: Draft<CheckoutState>, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryList.fulfilled, (state, action) => {
        state.countryList = action.payload;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.cartItems = [];
        state.currentStep = 0;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});


export const {
  setShippingAddress,
  setBillingAddress,
  setPaymentMethod,
  addCartItem,
  removeCartItem,
  setDeliveryOption,
  applyDiscount,
  updateTotalAmount,
  clearCheckout,
  setCurrentStep,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;

