import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

const shippingService = {
  // Fetch existing shipping methods
  async getShippingMethods(params: { country: string; currency: string }) {
    const { data } = await axios.get(`${API_BASE_URL}/shipping/methods`, { params });
    return data.map((method: any) => ({
      id: method.id,
      name: method.name,
      rate: method.rate,
      currency: method.currency,
      estimatedDelivery: method.estimatedDelivery,
    }));
  },

  // Calculate shipping cost
  async calculateShippingCost(params: { methodId: string; address: any }) {
    const { data } = await axios.post(`${API_BASE_URL}/shipping/calculate`, params);
    return data;
  },

  // Add a new shipping method
  async addShippingMethod(method: { name: string; rate: number; currency: string; estimatedDelivery: string }) {
    const { data } = await axios.post(`${API_BASE_URL}/shipping/methods`, method);
    return data;
  },

  // Delete a shipping method
  async deleteShippingMethod(methodId: string) {
    const { data } = await axios.delete(`${API_BASE_URL}/shipping/methods/${methodId}`);
    return data;
  },

  // Fetch existing regions
  async getRegions() {
    const { data } = await axios.get(`${API_BASE_URL}/shipping/regions`);
    return data.map((region: any) => ({
      id: region.id,
      name: region.name,
      rate: region.rate,
      currency: region.currency,
    }));
  },

  // Add a new region
  async addRegion(region: { name: string; rate: number; currency: string }) {
    const { data } = await axios.post(`${API_BASE_URL}/shipping/regions`, region);
    return data;
  },

  // Update an existing region
  async updateRegion(region: { id: string; name: string; rate: number; currency: string }) {
    const { data } = await axios.put(`${API_BASE_URL}/shipping/regions/${region.id}`, region);
    return data;
  },

  // Delete a region
  async deleteRegion(regionId: string) {
    const { data } = await axios.delete(`${API_BASE_URL}/shipping/regions/${regionId}`);
    return data;
  },

  async fetchShippingData(params: { country: string; currency: string }) {
    const response = await axios.get(`${API_BASE_URL}/shipping/data`, { params });
    return response.data;
  },

  async updateShippingSettings(settings: { id: string; updates: Record<string, any> }) {
    const response = await axios.put(`${API_BASE_URL}/shipping/settings/${settings.id}`, settings.updates);
    return response.data;
  },
  
};

export default shippingService;
