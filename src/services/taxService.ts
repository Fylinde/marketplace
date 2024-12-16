import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

const taxService = {
  // Fetch tax rates for a specific region or category
  async getTaxRates(params: { country: string; region?: string; category?: string }) {
    const { data } = await axios.get(`${API_BASE_URL}/tax/rates`, { params });
    return data.map((rate: any) => ({
      id: rate.id,
      country: rate.country,
      region: rate.region,
      category: rate.category,
      rate: rate.rate, // Percentage value (e.g., 10%)
    }));
  },

  // Calculate tax for a specific order
  async calculateTax(params: { price: number; country: string; region?: string; category?: string }) {
    const { data } = await axios.post(`${API_BASE_URL}/tax/calculate`, params);
    return data; // Returns total tax amount
  },

  // Fetch seller-specific tax configurations
  async getSellerTaxConfigurations(sellerId: string) {
    const { data } = await axios.get(`${API_BASE_URL}/tax/seller/${sellerId}/configurations`);
    return data;
  },

  // Update or add a seller-specific tax configuration
  async updateSellerTaxConfiguration(sellerId: string, config: { region: string; rate: number }) {
    const { data } = await axios.put(`${API_BASE_URL}/tax/seller/${sellerId}/configurations`, config);
    return data;
  },

  // Fetch supported countries for tax configurations
  async getSupportedCountries() {
    const { data } = await axios.get(`${API_BASE_URL}/tax/supported-countries`);
    return data;
  },

  async calculateBulkTax(items: { price: number; country: string; region?: string; category?: string }[]) {
    const { data } = await axios.post(`${API_BASE_URL}/tax/bulk-calculate`, { items });
    return data; // Returns an array of tax amounts per item
  }
  
};

export default taxService;
