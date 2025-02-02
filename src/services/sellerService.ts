import axios from "axios";

const BASE_API_URL = "https://api.example.com"; // Base API URL for sellers

// Seller Ratings
export const getSellerRating = (sellerId: string) => {
  return axios.get(`${BASE_API_URL}/sellers/${sellerId}/ratings`);
};

export const addSellerRating = (sellerId: string, ratingData: any) => {
  return axios.post(`${BASE_API_URL}/sellers/${sellerId}/ratings`, ratingData);
};

// Seller Details
export const getSellerDetails = () => {
  return axios.get(`${BASE_API_URL}/sellers/profile`);
};

export const updateSellerDetails = (data: any) => {
  return axios.put(`${BASE_API_URL}/sellers/profile`, data);
};

// Multi-Currency Pricing
export const getExchangeRates = () => {
  return axios.get(`${BASE_API_URL}/currency/exchange-rates`);
};

// Live Shopping
export const startLiveSession = (sessionDetails: any) => {
  return axios.post(`${BASE_API_URL}/live-shopping/start`, sessionDetails);
};

export const fetchLiveSessions = () => {
  return axios.get(`${BASE_API_URL}/live-shopping/sessions`);
};

// Chatbot Interaction
export const getChatbotResponse = (query: string) => {
  return axios.post(`${BASE_API_URL}/chatbot/query`, { query });
};

// Escrow Payments
export const initiateEscrowPayment = (transactionDetails: any) => {
  return axios.post(`${BASE_API_URL}/payments/escrow`, transactionDetails);
};

// Visual Shopping
export const getVisualTryOnProducts = (filters: any) => {
  return axios.get(`${BASE_API_URL}/visual-shopping/tryon`, { params: filters });
};

// Advanced Localization
export const getLocalizationData = (location: string) => {
  return axios.get(`${BASE_API_URL}/localization`, { params: { location } });
};
