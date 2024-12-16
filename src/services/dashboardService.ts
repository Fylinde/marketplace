import axios from 'axios';

const BASE_URL = '/api/dashboard'; // Replace with your actual backend API endpoint

const dashboardService = {
  async getSalesData() {
    const response = await axios.get(`${BASE_URL}/sales`);
    return response.data; // Expected: [{ date: '2024-01-01', sales: 100 }, ...]
  },

  async getInventoryData() {
    const response = await axios.get(`${BASE_URL}/inventory`);
    return response.data; // Expected: [{ status: 'Low', value: 10, color: '#ff0000' }, ...]
  },

  async getTrafficData() {
    const response = await axios.get(`${BASE_URL}/traffic`);
    return response.data; // Expected: { totalVisitors: 1000, conversionRate: 3.5 }
  },

  async getAchievements() {
    const response = await axios.get(`${BASE_URL}/achievements`);
    return response.data; // Expected: ['Top Seller Badge', '1000 Orders Milestone']
  },
};

export default dashboardService;
