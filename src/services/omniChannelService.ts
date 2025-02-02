import axios from 'axios';

const BASE_URL = '/api/omni-channel'; // Replace with your actual backend URL

const omniChannelService = {
  async getProducts() {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  },
  async getInventory() {
    const response = await axios.get(`${BASE_URL}/inventory`);
    return response.data;
  },
  async getOrders() {
    const response = await axios.get(`${BASE_URL}/orders`);
    return response.data;
  },
  async syncInventory(payload: any) {
    const response = await axios.post(`${BASE_URL}/inventory/sync`, payload);
    return response.data;
  },
};

export default omniChannelService;
