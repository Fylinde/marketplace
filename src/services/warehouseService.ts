import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

const warehouseService = {
  // Fetch all warehouses for a seller
  async getWarehouses() {
    const { data } = await axios.get(`${API_BASE_URL}/warehouses`);
    return data.map((warehouse: any) => ({
      id: warehouse.id,
      name: warehouse.name,
      location: warehouse.location,
      stock: warehouse.stock,
    }));
  },

  // Add a new warehouse
  async addWarehouse(warehouse: { name: string; location: string }) {
    const { data } = await axios.post(`${API_BASE_URL}/warehouses`, warehouse);
    return data;
  },

  // Update a warehouse
  async updateWarehouse(warehouse: { id: string; name: string; location: string }) {
    const { data } = await axios.put(`${API_BASE_URL}/warehouses/${warehouse.id}`, warehouse);
    return data;
  },

  // Delete a warehouse
  async deleteWarehouse(warehouseId: string) {
    const { data } = await axios.delete(`${API_BASE_URL}/warehouses/${warehouseId}`);
    return data;
  },

  // Fetch AI recommendations for stock distribution
  async getStockRecommendations() {
    const { data } = await axios.get(`${API_BASE_URL}/recommendations/stock`);
    return data.map((recommendation: any) => ({
      productId: recommendation.productId,
      warehouseId: recommendation.warehouseId,
      suggestedStock: recommendation.suggestedStock,
    }));
  },

  // Fetch shared inventory agreements (collaboration data)
  async getSharedInventory() {
    const { data } = await axios.get(`${API_BASE_URL}/collaborations/shared-inventory`);
    return data;
  },
};

export default warehouseService;
