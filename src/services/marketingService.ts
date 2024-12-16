import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';


const marketingService = {
  /**
   * Get marketing strategies for a seller.
   * @param params - Object containing sellerId and targetAudience.
   */
  getMarketingStrategies: async (params: { sellerId: string; targetAudience: string }) => {
    const response = await axios.get('/api/marketing/strategies', { params });
    return response.data;
  },

  /**
   * Apply a marketing strategy for a seller.
   * @param params - Object containing sellerId, strategyId, and budget.
   */
  applyStrategy: async (params: { sellerId: string; strategyId: string; budget: number }) => {
    const response = await axios.post('/api/marketing/apply', params);
    return response.data;
  },
};

export default marketingService;

  