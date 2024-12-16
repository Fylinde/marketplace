import axios from "axios";

const BASE_API_URL = "/api/fulfillment";

export interface FulfillmentOrder {
  id: string;
  status: "pending" | "fulfilled" | "cancelled";
  items: Array<{ productId: string; quantity: number }>;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FulfillmentOption {
    id: string;
    name: string;
    description: string; // Detailed description of the option
    type: "shipping" | "pickup" | "courier"; // Type of fulfillment
    price: number; // Cost of the fulfillment option
    estimatedDeliveryTime: string; // Estimated delivery time, e.g., "3-5 business days"
  }
  

const fulfillmentService = {
  fetchFulfillmentOrders: async (): Promise<FulfillmentOrder[]> => {
    const response = await axios.get<FulfillmentOrder[]>(`${BASE_API_URL}/orders`);
    return response.data;
  },

  updateOrderStatus: async (
    orderId: string,
    status: "fulfilled" | "cancelled"
  ): Promise<FulfillmentOrder> => {
    const response = await axios.patch<FulfillmentOrder>(
      `${BASE_API_URL}/orders/${orderId}/status`,
      { status }
    );
    return response.data;
  },

  getFulfillmentDetails: async (orderId: string): Promise<FulfillmentOrder> => {
    const response = await axios.get<FulfillmentOrder>(`${BASE_API_URL}/orders/${orderId}`);
    return response.data;
    },
  
    // Fetch all fulfillment options
    fetchFulfillmentOptions: async (): Promise<FulfillmentOption[]> => {
        const response = await axios.get<FulfillmentOption[]>(`${BASE_API_URL}/options`);
        return response.data;
      },
    
      // Add a new fulfillment option
      addFulfillmentOption: async (option: Omit<FulfillmentOption, "id">): Promise<FulfillmentOption> => {
        const response = await axios.post<FulfillmentOption>(`${BASE_API_URL}/options`, option);
        return response.data;
      },
    
      // Update an existing fulfillment option
      updateFulfillmentOption: async (
        optionId: string,
        updates: Partial<Omit<FulfillmentOption, "id">>
      ): Promise<FulfillmentOption> => {
        const response = await axios.patch<FulfillmentOption>(
          `${BASE_API_URL}/options/${optionId}`,
          updates
        );
        return response.data;
      },
    
      // Delete a fulfillment option
      deleteFulfillmentOption: async (optionId: string): Promise<void> => {
        await axios.delete(`${BASE_API_URL}/options/${optionId}`);
    },
      
    async addOption(newOption: Omit<FulfillmentOption, "id">): Promise<FulfillmentOption> {
        const response = await axios.post<FulfillmentOption>("/api/fulfillment/options", newOption);
        return response.data;
      },
      
      
    async updateOption(id: string, updates: Partial<FulfillmentOption>): Promise<FulfillmentOption> {
    const response = await axios.put<FulfillmentOption>(`/api/fulfillment/options/${id}`, updates);
    return response.data;
    }
          
};

export default fulfillmentService;
