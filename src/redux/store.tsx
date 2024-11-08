import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import registrationReducer from './slices/registrationSlice';
import productReducer from "./slices/productSlice";
import vendorReducer from "./slices/vendorSlice" 
const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
    products: productReducer,
    vendors: vendorReducer,
  },
  // Directly enabling DevTools without needing composeWithDevTools for typical use cases
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
