// src/services/RecommendationService.ts
import axios from "axios";

const BASE_URL = "/api/recommendation";

const RecommendationService = {
  /**
   * Fetch personalized recommendations for a logged-in user.
   */
  getPersonalizedRecommendations: async (userId: string, limit = 10) => {
    const response = await axios.get(`${BASE_URL}/personalized`, {
      params: { userId, limit },
    });
    return response.data;
    },
    
    /**
 * Fetch AI-powered personalized recommendations.
 */
  getAIPersonalizedRecommendations: async (userId: string, limit = 10) => {
    const response = await axios.get(`${BASE_URL}/ai-personalized`, {
      params: { userId, limit },
    });
    return response.data;
   },
   

  /**
   * Fetch recommendations based on a specific product.
   */
  getProductRecommendations: async (productId: string, limit = 10) => {
    const response = await axios.get(`${BASE_URL}/product`, {
      params: { productId, limit },
    });
    return response.data;
    },
  
  

  /**
   * Fetch recommendations based on search queries.
   */
  getSearchBasedRecommendations: async (query: string, limit = 10) => {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { query, limit },
    });
    return response.data;
    },
  
  /**
 * Fetch cross-selling recommendations.
 */
getCrossSellingRecommendations: async (productId: string, limit = 10) => {
    const response = await axios.get(`${BASE_URL}/cross-selling`, {
      params: { productId, limit },
    });
    return response.data;
  },
  
  /**
   * Fetch upselling recommendations.
   */
  getUpsellingRecommendations: async (productId: string, limit = 10) => {
    const response = await axios.get(`${BASE_URL}/upselling`, {
      params: { productId, limit },
    });
    return response.data;
    },
  /**
 * Log user interaction with a recommended product.
 */
logUserInteraction: async (interaction: { userId: string; productId: string; action: string }) => {
    const response = await axios.post(`${BASE_URL}/log-interaction`, interaction);
    return response.data;
  },
  
  
};

export default RecommendationService;
