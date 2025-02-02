import axios from "axios";
import { WishlistItem } from "../redux/slices/orders/wishlistSlice";

export const fetchWishlistAPI = async (): Promise<WishlistItem[]> => {
  const response = await axios.get("/api/wishlist");
  return response.data;
};

export const addToWishlistAPI = async (item: WishlistItem): Promise<WishlistItem> => {
  const response = await axios.post("/api/wishlist", item);
  return response.data;
};

export const removeFromWishlistAPI = async (itemId: string): Promise<void> => {
  await axios.delete(`/api/wishlist/${itemId}`);
};

export const fetchRecommendationsAPI = async (
  items: WishlistItem[]
): Promise<WishlistItem[]> => {
  const response = await axios.post("/api/wishlist/recommendations", { items });
  return response.data;
};

export const shareWishlistAPI = async (emails: string[]): Promise<void> => {
  await axios.post("/api/wishlist/share", { emails });
};
