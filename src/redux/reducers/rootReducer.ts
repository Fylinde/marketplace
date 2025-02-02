import { combineReducers, AnyAction  } from "@reduxjs/toolkit";


// Authentication and users
import authReducer from "../slices/auth/authSlice";
import registrationReducer from "../slices/auth/registrationSlice";
import userReducer from "../slices/auth/userSlice";
import sellerReducer from "../slices/auth/sellerSlice";
import accountReducer from "../slices/auth/accountSlice";
import sellerRegistrationReducer from "../slices/auth/sellerRegistrationSlice"

// Order Slice
import cartReducer from "../slices/orders/cartSlice";
import orderReducer from "../slices/orders/orderSlice";
import checkoutReducer from "../slices/orders/checkoutSlice";
import wishlistReducer from "../slices/orders/wishlistSlice";
import paymentReducer from "../slices/orders/paymentSlice";
import billingReducer from "../slices/orders/billingSlice";
import transactionReducer from "../slices/orders/transactionSlice";
import cryptoReducer from "../slices/orders/cryptoSlice";
import currencyReducer from "../slices/orders/currencySlice";
import escrowReducer from "../slices/orders/escrowSlice";


// Product Slice
import productReducer from "../slices/products/productSlice";
import productCardReducer from "../slices/products/productCardSlice";
import categoryReducer from "../slices/products/categorySlice";
import inventoryReducer from "../slices/products/inventorySlice";
import omniChannelReducer from "../slices/products/omniChannelSlice";
import brandReducer from "../slices/products/brandSlice";
import productFilterReducer from "../slices/products/productFilterSlice"


// Dashboard Slice
import dashboardReducer from "../slices/dashboard/dashboardSlice";
import enhancementsReducer from "../slices/dashboard/enhancementsSlice";
import trainingReducer from "../slices/dashboard/trainingSlice";


// Analytics
import analyticsReducer from "../slices/analytics/analyticsSlice";
import performanceReducer from "../slices/analytics/performanceSlice";
import fraudReducer from "../slices/analytics/fraudSlice";
import sustainabilityReducer from "../slices/analytics/sustainabilitySlice";


// Communication slice
import chatbotReducer from "../slices/communication/chatbotSlice ";
import commentReducer from "../slices/communication/commentSlice";
import notificationReducer from "../slices/communication/notificationSlice";
import messageReducer from "../slices/communication/messageSlice"
import chatReducer from "../slices/communication/chatSlice"



// Logistics
import shippingReducer from "../slices/logistics/shippingSlice";
import warehouseReducer from "../slices/logistics/warehouseSlice";
import taxReducer from "../slices/logistics/taxSlice";
import fulfillmentReducer from "../slices/logistics/fulfillmentSlice";
import addressReducer from "../slices/logistics/addressSlice";



// Narketing 
import marketingReducer from "../slices/marketing/marketSlice";
import b2bReducer from "../slices/marketing/b2bSlice";
import c2cReducer from "../slices/marketing/c2cSlice";
import bannerReducer from "../slices/marketing/bannerSlice";
import featureReducer from "../slices/marketing/featureSlice";
import promoCodeReducer from "../slices/marketing/promoSlice";
import rewardReducer from "../slices/marketing/rewardsSlice";
import recommendationReducer from "../slices/marketing/recommendationSlice";
import discountReducer from "../slices/marketing/discountSlice"
import marketReducer from "../slices/marketing/marketSlice"
import advertisementReducer from "../slices/marketing/advertisementSlice"

// Security Slice
import securityReducer from "../slices/security/securitySlice";
import certificationReducer from "../slices/security/certificationSlice";
import regionReducer from "../slices/security/regionSlice";


// Support slice
import aiReducer from "../slices/support/aiSlice";
import serviceReducer from "../slices/support/serviceSlice"
import supportReducer from "../slices/support/supportSlice";
import feedbackReducer from "../slices/support/feedbackSlice";
import disputeReducer from "../slices/support/disputeSlice";
import filterReducer from "../slices/support/filterSlice";
import navigationReducer from "../slices/support/navigationSlice"


// Miscellaneous utilities
import priceReducer from "../slices/orders/priceSlice";
import exchangeRateReducer from "../slices/utils/exchangeRateSlice"
import searchReducer from "../slices/utils/searchSlice";
import tryOnReducer from "../slices/utils/tryOnSlice";


//import productReducer from "../slices/products/productSlice"
// Placeholder Reducers for Future Sections


//const productReducer = (state = {}, action: AnyAction) => state; // Products
// const orderReducer = (state = {}, action: AnyAction) => state; // Orders

const rootReducer = combineReducers({


// Authentication and users
  auth: authReducer,
  registration: registrationReducer,
  user: userReducer,
  sellers: sellerReducer,
  account: accountReducer,
  sellerRegistration: sellerRegistrationReducer,

    // Orders
    cart: cartReducer,
    orders: orderReducer,
    checkout: checkoutReducer,
    wishlist: wishlistReducer,
    payments: paymentReducer,
    billing: billingReducer,
    transaction: transactionReducer,
    crypto: cryptoReducer,
    currency: currencyReducer,
    escrow: escrowReducer,
  //products: productReducer, // Add products reducer
  
    
     // Products
  products: productReducer,
  productCard: productCardReducer,
  categories: categoryReducer,
  inventory: inventoryReducer,
  omniChannel: omniChannelReducer,
  brands: brandReducer,
  productFilters: productFilterReducer,


   // Dashboard
   dashboard: dashboardReducer,
   enhancements: enhancementsReducer,
    training: trainingReducer,
   

      // Analytics
  analytics: analyticsReducer,
  performance: performanceReducer,
  fraud: fraudReducer,
  sustainability: sustainabilityReducer,


   // Communication
   chatbot: chatbotReducer,
   comments: commentReducer,
   notifications: notificationReducer,
   message: messageReducer,
    chat: chatReducer,
   

      // Logistics
  shipping: shippingReducer,
  warehouse: warehouseReducer,
  tax: taxReducer,
  fulfillment: fulfillmentReducer,
    address: addressReducer,
  


      // Marketing
  marketing: marketingReducer,
  b2b: b2bReducer,
  c2c: c2cReducer,
  banners: bannerReducer,
  features: featureReducer,
  promoCode: promoCodeReducer,
  rewards: rewardReducer,
  recommendation: recommendationReducer,
  discount: discountReducer,
  market: marketReducer,
  advertisements: advertisementReducer,
  

    // Security
    security: securityReducer,
    certifications: certificationReducer,
    region: regionReducer,


     // Support
  support: supportReducer,
  feedback: feedbackReducer,
  disputes: disputeReducer,
  filters: filterReducer,
  navigation: navigationReducer,
  ai: aiReducer,
  service: serviceReducer,
  

      // Miscellaneous utilities

  price: priceReducer,
  search: searchReducer,
  tryOn: tryOnReducer,
  exchangeRate: exchangeRateReducer,
  placeholder: (state = {}, action: AnyAction) => state, // Keep placeholder for debugging
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
