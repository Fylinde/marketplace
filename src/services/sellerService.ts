import axios from "axios";

const SELLER_API_URL = "https://api.example.com/sellers"; // Base URL for vendors

// Fetch vendor ratings by vendorId
export const getSellerRating = (sellerId: string) => {
  return axios.get(`${SELLER_API_URL}/${sellerId}/ratings`);
};

// Add a new rating for a vendor
export const addSellerRating = (sellerId: string, ratingData: any) => {
  return axios.post(`${SELLER_API_URL}/${sellerId}/ratings`, ratingData);
};
