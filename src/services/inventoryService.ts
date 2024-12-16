import axios from "axios";

// Define the structure of inventory items
interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  category: string;
}

// Define the structure for updates to inventory items
interface InventoryUpdate {
  productId: string;
  updates: Partial<InventoryItem>;
}

const BASE_URL = "/api/inventory";

// Fetch inventory with proper typing
const getInventory = async (sellerId: string): Promise<InventoryItem[]> => {
  const response = await axios.get<InventoryItem[]>(`${BASE_URL}`, { params: { sellerId } });
  return response.data;
};

// Update inventory with proper typing
const updateInventory = async ({ productId, updates }: InventoryUpdate): Promise<InventoryItem> => {
  const response = await axios.put<InventoryItem>(`${BASE_URL}/${productId}`, updates);
  return response.data;
};

const inventoryService = {
  getInventory,
  updateInventory,
};

export default inventoryService;
