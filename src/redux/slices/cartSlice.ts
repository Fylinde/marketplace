import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Cart Item Interface
interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  vendorId?: string; // Vendor-specific information
  category?: string; // Category for analytics
  discount?: number; // Percentage discount on the product
}

// Define Cart State Interface
interface CartState {
  cartList: CartItem[];
  totalAmount: number;
  totalItems: number;
  discount: number; // Overall discount on the cart
  couponCode?: string; // Applied coupon code
}

// Initial State
const initialState: CartState = {
  cartList: [],
  totalAmount: 0,
  totalItems: 0,
  discount: 0,
  couponCode: undefined,
};

// Utility Function to Calculate Totals
const calculateCartTotals = (items: CartItem[]): { totalAmount: number; totalItems: number } => {
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalAmount, totalItems };
};

// Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add an item to the cart
    addItem: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.cartList.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + item.quantity, item.stock); // Ensure it doesn't exceed stock
      } else {
        state.cartList.push({ ...item, quantity: Math.min(item.quantity, item.stock) });
      }
      const { totalAmount, totalItems } = calculateCartTotals(state.cartList);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;
    },

    // Remove an item from the cart
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartList = state.cartList.filter((item) => item.id !== action.payload);
      const { totalAmount, totalItems } = calculateCartTotals(state.cartList);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;
      },
    
      // Change the quantity of an item (changeCartAmount)
      changeCartAmount: (state, action: PayloadAction<{ id: string; amount: number }>) => {
        const { id, amount } = action.payload;
        const existingItem = state.cartList.find((item) => item.id === id);
        if (existingItem) {
          // Update the quantity, ensuring it doesn't exceed stock and doesn't go below 1
          existingItem.quantity = Math.max(1, Math.min(amount, existingItem.stock));
        }
        const { totalAmount, totalItems } = calculateCartTotals(state.cartList);
        state.totalAmount = totalAmount;
        state.totalItems = totalItems;
      },

    // Update the quantity of an item
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartList.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = Math.min(quantity, existingItem.stock); // Ensure it doesn't exceed stock
      }
      const { totalAmount, totalItems } = calculateCartTotals(state.cartList);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;
    },

    // Apply a discount to the entire cart
    applyDiscount: (state, action: PayloadAction<{ discount: number; couponCode: string }>) => {
      const { discount, couponCode } = action.payload;
      state.discount = discount;
      state.couponCode = couponCode;
      state.totalAmount = state.totalAmount * (1 - discount / 100); // Apply the discount
    },

    // Clear the cart
    clearCart: (state) => {
      state.cartList = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      state.discount = 0;
      state.couponCode = undefined;
    },

    // Restore the cart from local storage
    restoreCart: (state, action: PayloadAction<CartState>) => {
      state.cartList = action.payload.cartList;
      state.totalAmount = action.payload.totalAmount;
      state.totalItems = action.payload.totalItems;
      state.discount = action.payload.discount;
      state.couponCode = action.payload.couponCode;
    },
  },
});

// Export Actions
export const {
  addItem,
  removeItem,
  updateQuantity,
  changeCartAmount,
  applyDiscount,
  clearCart,
  restoreCart,
} = cartSlice.actions;

// Cart Slice Reducer
export default cartSlice.reducer;

// Middleware or Side Effects (Optional)
// Use Redux Middleware or Thunks to persist cart data in local storage
export const persistCart = (cartState: CartState) => {
  localStorage.setItem("cart", JSON.stringify(cartState));
};

export const loadCart = (): CartState => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    return JSON.parse(storedCart) as CartState;
  }
  return initialState;
};
