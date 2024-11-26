import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

const priceService = {
  async getPriceRecommendations(params: { sellerId: string; region: string }) {
    const { data } = await axios.get(`${API_BASE_URL}/ai/price-recommendations`, { params });
    return data.map((recommendation: any) => ({
      productId: recommendation.productId,
      currentPrice: recommendation.currentPrice,
      suggestedPrice: recommendation.suggestedPrice,
      reason: recommendation.reason,
    }));
    },
async updatePrice(params: { productId: string; price: number }) {
    const { data } = await axios.put(`${API_BASE_URL}/price/${params.productId}`, { price: params.price });
    return data;
    },
};

export default priceService;
