import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import registrationReducer from './slices/registrationSlice';
import productReducer from './slices/productSlice';
import vendorReducer from './slices/vendorSlice';
import cartReducer from './slices/cartSlice';
import commentReducer from './slices/commentSlice'; // Import the comment reducer
import checkoutReducer from './slices/checkoutSlice';
import addressReducer from "./slices/addressSlice";
import filterReducer from "./slices/filterSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice"; // Import the order reducer
import accountReducer from './slices/accountSlice';
import enhancementsReducer from "./slices/enhancementsSlice";
import performanceReducer from "./slices/performanceSlice";
import paymentReducer from "./slices/paymentSlice";
import tryOnReducer from './slices/tryOnSlice';
import chatbotReducer from './slices/chatbotSlice ';
import shippingReducer from "./slices/shippingSlice"
import warehouseReducer from "./slices/warehouseSlice"
import taxReducer from "./slices/taxSlice"
import aiReducer from "./slices/aiSlice"
import priceReducer from "./slices/priceSlice"
import chatReducer from "./slices/chatSlice"
import brandReducer from "./slices/brandSlice"
import productCardReducer from "./slices/productCardSlice"

const store = configureStore({
  reducer: {
    productCard: productCardReducer,
    brands: brandReducer,
    chat: chatReducer,
    price: priceReducer,
    ai: aiReducer,
    tax: taxReducer,
    warehouse: warehouseReducer,
    shipping: shippingReducer,
    chatbot: chatbotReducer,
    tryOn: tryOnReducer,
    payments: paymentReducer,
    performance: performanceReducer,
    enhancements: enhancementsReducer,
    account: accountReducer, 
    orders: orderReducer, // Correctly reference the orderReducer here
    wishlist: wishlistReducer,
    filters: filterReducer,
    address: addressReducer,
    auth: authReducer,
    registration: registrationReducer,
    products: productReducer,
    vendors: vendorReducer,
    cart: cartReducer,
    comments: commentReducer, // Use the reducer function from commentSlice
    checkout: checkoutReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export type RootState = ReturnType<typeof store.getState>; // Infer the RootState type from the store
export type AppDispatch = typeof store.dispatch; // Infer the AppDispatch type from the store
export default store;
