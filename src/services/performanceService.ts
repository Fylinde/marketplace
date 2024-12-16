// Enhanced performanceService.ts
import axios from "../redux/slices/utils/axiosSetup";

const BASE_URL = "/api/performance"; // Adjust based on your API endpoint

export interface PerformanceMetrics {
  dates: string[];
  sales: number[];
  revenue: number[];
  couponsUsed: number;
  couponRevenue: number;
  revenueBreakdown?: any;
}

const performanceService = {
  /**
   * Fetch performance metrics for coupons and deals.
   * @returns {Promise<PerformanceMetrics>} Performance data
   */
  getPerformanceMetrics: async (): Promise<PerformanceMetrics> => {
    try {
      const response = await axios.get(`${BASE_URL}/metrics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching performance metrics", error);
      throw new Error("Failed to fetch performance metrics");
    }
  },

  /**
   * Fetch detailed revenue breakdown.
   * @returns {Promise<any>} Revenue breakdown data
   */
  getRevenueBreakdown: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/revenue-breakdown`);
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue breakdown", error);
      throw new Error("Failed to fetch revenue breakdown");
    }
  },
};

export default performanceService;
