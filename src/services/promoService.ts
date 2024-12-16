import axios from "axios";

const promoService = {
  async validatePromoCode(code: string): Promise<{ discount: number }> {
    const response = await axios.post("/api/promos/validate", { code });
    return response.data; // Expected response: { discount: number }
  },
};

export default promoService;
