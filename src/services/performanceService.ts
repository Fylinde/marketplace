import axios from "../redux/slices/axiosSetup"; // Ensure axios is properly configured


const BASE_URL = "/api/performance"; // Adjust based on your API endpoint

const performanceService = {
  /**
   * Fetch performance metrics for coupons and deals.
   * @returns {Promise<{ couponsUsed: number; couponRevenue: number }>} Performance data
   */
  getPerformanceMetrics: async (): Promise<{ couponsUsed: number; couponRevenue: number }> => {
    try {
      const response = await axios.get(`${BASE_URL}/metrics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching performance metrics", error);
      throw new Error("Failed to fetch performance metrics");
    }
  },
};

export default performanceService;
