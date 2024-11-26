import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';


const marketingService = {
    async getMarketingStrategies(params: { sellerId: string; targetAudience: string }) {
      const { data } = await axios.get(`${API_BASE_URL}/ai/marketing-strategies`, { params });
      return data.map((strategy: any) => ({
        strategyId: strategy.strategyId,
        title: strategy.title,
        description: strategy.description,
        expectedROI: strategy.expectedROI,
      }));
    },
  };
  
  export default marketingService;
  