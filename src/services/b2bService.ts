import axios from "axios";

const BASE_URL = "/api/b2b";

// Define the types for the parameters and response
interface B2BPricing {
  id: string;
  price: number;
  productName: string;
  category: string;
}

interface UpdateB2BPricingParams {
  sellerId: string;
  pricing: B2BPricing[];
}

const getB2BPricing = async (sellerId: string): Promise<B2BPricing[]> => {
  const response = await axios.get<B2BPricing[]>(`${BASE_URL}/pricing`, { params: { sellerId } });
  return response.data;
};

const updateB2BPricing = async ({ sellerId, pricing }: UpdateB2BPricingParams): Promise<B2BPricing[]> => {
  const response = await axios.put<B2BPricing[]>(`${BASE_URL}/pricing`, { sellerId, pricing });
  return response.data;
};

const b2bService = {
  getB2BPricing,
  updateB2BPricing,
};

export default b2bService;
