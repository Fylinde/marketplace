import axios from 'axios';

const BASE_URL = '/api/sustainability'; // Replace with your backend API endpoint

const sustainabilityService = {
  async getSustainabilityMetrics() {
    const response = await axios.get(`${BASE_URL}/metrics`);
    return response.data; // Expected: { emissions: 120, ecoProducts: 10, recyclablePackaging: 80, offsetContributions: 200 }
  },

  async getSustainabilityAchievements() {
    const response = await axios.get(`${BASE_URL}/achievements`);
    return response.data; // Expected: ['Carbon Neutral Seller', 'Eco-Friendly Badge']
  },

  async submitSustainabilityGoal(payload: { goal: string; value: number }) {
    const response = await axios.post(`${BASE_URL}/goals`, payload);
    return response.data; // Response may include goal status or updated metrics.
  },
};

export default sustainabilityService;
