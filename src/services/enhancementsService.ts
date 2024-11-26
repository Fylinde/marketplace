
import axios from "axios";
import { Coupon } from "../types/coupon"; // Define a Coupon type if not available

const BASE_URL = "/api/enhancements"; // Adjust based on your API structure

const enhancementsService = {
  /**
   * Fetch all coupons and deals.
   * @returns {Promise<Coupon[]>} A promise that resolves to an array of coupons.
   */
  getCoupons: async (): Promise<Coupon[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/coupons`);
      return response.data;
    } catch (error) {
      console.error("Error fetching coupons", error);
      throw new Error("Failed to fetch coupons");
    }
  },

  /**
   * Create a new coupon.
   * @param {Partial<Coupon>} couponData - The data for the new coupon.
   * @returns {Promise<Coupon>} A promise that resolves to the created coupon.
   */
  createCoupon: async (couponData: Partial<Coupon>): Promise<Coupon> => {
    try {
      const response = await axios.post(`${BASE_URL}/coupons`, couponData);
      return response.data;
    } catch (error) {
      console.error("Error creating coupon", error);
      throw new Error("Failed to create coupon");
    }
  },

  /**
   * Delete a coupon by ID.
   * @param {string} couponId - The ID of the coupon to delete.
   * @returns {Promise<string>} A promise that resolves to the deleted coupon ID.
   */
  deleteCoupon: async (couponId: string): Promise<string> => {
    try {
      await axios.delete(`${BASE_URL}/coupons/${couponId}`);
      return couponId;
    } catch (error) {
      console.error("Error deleting coupon", error);
      throw new Error("Failed to delete coupon");
    }
  },

  /**
   * Fetch performance metrics related to coupons and deals.
   * @returns {Promise<any>} A promise that resolves to performance data.
   */
  getPerformanceMetrics: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/performance`);
      return response.data;
    } catch (error) {
      console.error("Error fetching performance metrics", error);
      throw new Error("Failed to fetch performance metrics");
    }
  },
};

export default enhancementsService;
