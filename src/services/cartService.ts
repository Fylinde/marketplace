// services/cartService.ts
import axios from "axios";
import { CartItem } from "../types/cartItem";


const BASE_API_URL = "/api/cart"; // Replace with your API base URL

const cartService = {
  // Fetch all items in the cart
  async fetchCartItems() {
    const response = await axios.get(`${BASE_API_URL}`);
    return response.data; // Assumes response includes cart items
  },

  // Add an item to the cart
  async addItemToCart(productId: string, quantity: number) {
    const response = await axios.post(`${BASE_API_URL}/add`, { productId, quantity });
    return response.data; // Assumes response includes updated cart
  },

  async convertPrices(cartItems: CartItem[], currency: string) {
    const response = await axios.post(`${BASE_API_URL}/convert-prices`, { cartItems, currency });
    return response.data; // { [productId]: buyerPrice }
  },

  async fetchTryOnEnabledItems() {
    const response = await axios.get(`${BASE_API_URL}/try-on-enabled`);
    return response.data; // Array of TryOn-enabled items
  },

  // Update the quantity of an item in the cart
  async updateCartItem(productId: string, quantity: number) {
    const response = await axios.put(`${BASE_API_URL}/update`, { productId, quantity });
    return response.data; // Assumes response includes updated cart
  },

  // Remove an item from the cart
  async removeItemFromCart(productId: string) {
    const response = await axios.delete(`${BASE_API_URL}/remove/${productId}`);
    return response.data; // Assumes response includes updated cart
  },

  // Clear the cart
  async clearCart() {
    const response = await axios.delete(`${BASE_API_URL}/clear`);
    return response.data; // Assumes response includes a success message
  },

  // Get the total price, including currency conversion
  async getCartTotal(currency: string) {
    const response = await axios.get(`${BASE_API_URL}/total?currency=${currency}`);
    return response.data; // Assumes response includes total price
  },

  // Fetch personalized recommendations based on the cart
  async fetchRecommendations(cartItems: any[]) {
    const response = await axios.post(`${BASE_API_URL}/recommendations`, { cartItems });
    return response.data; // Assumes response includes product recommendations
  },

  // Notify user about free shipping thresholds
  async fetchFreeShippingThreshold() {
    const response = await axios.get(`${BASE_API_URL}/free-shipping-threshold`);
    return response.data; // Assumes response includes threshold amount
  },

  // Track abandoned carts
  async trackAbandonedCart(userId: string, cartItems: any[]) {
    const response = await axios.post(`${BASE_API_URL}/track-abandonment`, { userId, cartItems });
    return response.data; // Assumes response includes success message
    },


  // Apply a discount to the cart
  async applyDiscount(couponCode: string): Promise<{ discount: number; updatedTotal: number }> {
    const response = await axios.post(`${BASE_API_URL}/apply-discount`, { couponCode });
    return response.data;
  },

};

export default cartService;
