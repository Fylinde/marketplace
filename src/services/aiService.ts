import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

const aiService = {
    async getPriceRecommendations(params: { sellerId: string; region: string }) {
        const { data } = await axios.get(`${API_BASE_URL}/recommendations/price`, { params });
        return data;
      },
    
      async getDiscountRecommendations(params: { sellerId: string; season: string }) {
        const { data } = await axios.get(`${API_BASE_URL}/recommendations/discount`, { params });
        return data;
      },
    
      async getMarketingStrategies(params: { sellerId: string; targetAudience: string }) {
        const { data } = await axios.get(`${API_BASE_URL}/recommendations/marketing`, { params });
        return data;
      },
    
      async getBuyerRecommendations(params: { buyerId: string; language: string; currency: string }) {
        const { data } = await axios.get('/api/recommendations/buyer', { params });
        return data.map((recommendation: any) => ({
          productId: recommendation.productId,
          name: recommendation.name,
          price: recommendation.price,
          currency: recommendation.currency,
          imageUrl: recommendation.imageUrl,
        }));
      },
    
    
  // Fetch personalized product recommendations for a buyer
  async getRecommendations(params: { buyerId: string; language: string; currency: string }) {
    const { data } = await axios.get(`${API_BASE_URL}/ai/recommendations`, { params });
    return data.map((recommendation: any) => ({
      productId: recommendation.productId,
      name: recommendation.name,
      price: recommendation.price,
      currency: recommendation.currency,
      imageUrl: recommendation.imageUrl,
    }));
  },

  // Fetch stock insights for sellers
  async getStockInsights(params: { sellerId: string; language: string; currency: string }) {
    const { data } = await axios.get(`${API_BASE_URL}/ai/stock-insights`, { params });
    return data.map((insight: any) => ({
      productId: insight.productId,
      recommendedStock: insight.recommendedStock,
      demandForecast: insight.demandForecast,
    }));
  },

  // Process chatbot queries
  async queryChatbot(params: { query: string; language: string; userId?: string }) {
    const { data } = await axios.post(`${API_BASE_URL}/ai/chatbot`, params);
    return data.response;
  },

  // Fetch Try-On product data
  async getTryOnData(productId: string) {
    const { data } = await axios.get(`${API_BASE_URL}/ai/try-on/${productId}`);
    return data; // Contains AR model or visualization data
  },
};

export default aiService;
