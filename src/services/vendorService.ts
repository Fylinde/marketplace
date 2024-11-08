import axios from "axios";

const VENDOR_API_URL = "https://api.example.com/vendors"; // Base URL for vendors

// Fetch vendor ratings by vendorId
export const getVendorRating = (vendorId: string) => {
  return axios.get(`${VENDOR_API_URL}/${vendorId}/ratings`);
};

// Add a new rating for a vendor
export const addVendorRating = (vendorId: string, ratingData: any) => {
  return axios.post(`${VENDOR_API_URL}/${vendorId}/ratings`, ratingData);
};
