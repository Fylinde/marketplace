import { createSlice, PayloadAction, Draft } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  cardType: string;
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface DeliveryOption {
  date: string;
  time: string;
  price: number;
}

export interface CheckoutState {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  paymentMethod: PaymentMethod | null;
  cartItems: CartItem[];
  deliveryOption: DeliveryOption | null;
  totalAmount: number;
  discount: number;
  countryList: { label: string; value: string }[];
}

const initialState: CheckoutState = {
  shippingAddress: null,
  billingAddress: null,
  paymentMethod: null,
  cartItems: [],
  deliveryOption: null,
  totalAmount: 0,
  discount: 0,
  countryList: [],
};

export const fetchCountryList = createAsyncThunk(
  "checkout/fetchCountryList",
  async () => {
    const response = await axios.get("/api/countries"); // Replace with your API endpoint
    return response.data.map((country: any) => ({
      label: country.name,
      value: country.code,
    }));
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
    },
    removeCartItem(state: Draft<CheckoutState>, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    setDeliveryOption(state: Draft<CheckoutState>, action: PayloadAction<DeliveryOption>) {
      state.deliveryOption = action.payload;
    },
    applyDiscount(state: Draft<CheckoutState>, action: PayloadAction<number>) {
      state.discount = action.payload;
    },
    updateTotalAmount(state: Draft<CheckoutState>) {
      const itemsTotal = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const deliveryFee = state.deliveryOption ? state.deliveryOption.price : 0;
      state.totalAmount = itemsTotal + deliveryFee - state.discount;
    },
    clearCheckout(state: Draft<CheckoutState>) {
      state.shippingAddress = null;
      state.billingAddress = null;
      state.paymentMethod = null;
      state.cartItems = [];
      state.deliveryOption = null;
      state.totalAmount = 0;
      state.discount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCountryList.fulfilled, (state, action) => {
      state.countryList = action.payload;
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
} = checkoutSlice.actions;

export default checkoutSlice.reducer;

