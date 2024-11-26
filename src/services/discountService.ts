import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';


const discountService = {
    async getDiscountRecommendations(params: { sellerId: string; season: string }) {
      const { data } = await axios.get(`${API_BASE_URL}/ai/discount-recommendations`, { params });
      return data.map((recommendation: any) => ({
        productId: recommendation.productId,
        currentDiscount: recommendation.currentDiscount,
        suggestedDiscount: recommendation.suggestedDiscount,
        reason: recommendation.reason,
      }));
    },
    async updateDiscount(params: { productId: string; discount: number }) {
        const { data } = await axios.put(`${API_BASE_URL}/discount/${params.productId}`, { discount: params.discount });
        return data;
      },
  };
  
  export default discountService;
  