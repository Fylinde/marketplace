import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.example.com";

export const getSegmentAnalytics = async (segment: "B2C" | "B2B" | "C2C") => {
  return axios.get(`${API_BASE_URL}/analytics/segments/${segment}`);
};

export const getSalesTrends = async () => {
  return axios.get(`${API_BASE_URL}/analytics/sales-trends`);
};

export const getFlashDealPerformance = async () => {
  return axios.get(`${API_BASE_URL}/analytics/flash-deals`);
};

export const getGeneralAnalytics = async () => {
  return axios.get(`${API_BASE_URL}/analytics/general`);
};

export default {
  getSegmentAnalytics,
  getSalesTrends,
  getFlashDealPerformance,
  getGeneralAnalytics,
};
