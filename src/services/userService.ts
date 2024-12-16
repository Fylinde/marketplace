import axios from 'axios';
import { UserSegment } from '../redux/slices/auth/userSlice';
import { UserProfile } from '../redux/slices/auth/userSlice';
import { WishlistItem } from '../redux/slices/orders/wishlistSlice';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';


export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axios.get(`${API_BASE_URL}/users/profile`);
  return response.data;
};

export const addProductToWishlist = async (productId: string): Promise<WishlistItem[]> => {
  const response = await axios.post(`${API_BASE_URL}/users/wishlist`, { productId });
  return response.data;
};

export const removeProductFromWishlist = async (productId: string): Promise<WishlistItem[]> => {
  const response = await axios.delete(`${API_BASE_URL}/users/wishlist/${productId}`);
  return response.data;
};

export const updatePreferences = async (preferences: { segment: UserSegment }): Promise<UserProfile> => {
  const response = await axios.put(`${API_BASE_URL}/users/preferences`, preferences);
  return response.data;
};

export const addProductToCart = async (
  productId: string,
  quantity: number
): Promise<{ productId: string; quantity: number }[]> => {
  const response = await axios.post(`${API_BASE_URL}/users/cart`, { productId, quantity });
  return response.data;
};

export const getBrowsingHistory = async (): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/users/browsing-history`);
  return response.data;
};



const userService = {
  getUserProfile,
  updatePreferences,
  addProductToWishlist,
  removeProductFromWishlist,
  addProductToCart,
  getBrowsingHistory,
};

export default userService;
