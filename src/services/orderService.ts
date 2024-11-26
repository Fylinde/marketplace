import axios from "redux/slices/axiosSetup";
import { Order } from "types/order";


const orderService = {
  /**
   * Fetch all orders.
   * @param filters Filters for fetching orders.
   */
  async getOrders(): Promise<Order[]> {
    const response = await axios.get<Order[]>("/api/orders");
    return response.data; // Return the raw array of orders
  },

  /**
   * Fetch details for a specific order.
   * @param orderId The ID of the order to fetch.
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await axios.get<Order>(`/api/orders/${orderId}`);
    return response.data; // Return the raw order object
  },

  /**
   * Update the status of a specific order.
   * @param orderId The ID of the order.
   * @param status The new status for the order.
   */
  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
    const response = await axios.patch<Order>(`/api/orders/${orderId}/status`, { status });
    return response.data; // Return the updated order
  },

  /**
   * Fetch order history.
   */
  async getOrderHistory(): Promise<Order[]> {
    const response = await axios.get<Order[]>("/api/orders/history");
    return response.data; // Return the raw array of orders from history
  },

  /**
   * Process a refund for a specific order.
   * @param orderId The ID of the order.
   * @param amount The amount to refund.
   * @param reason The reason for the refund.
   */
  async processRefund(orderId: string, amount: number, reason: string): Promise<{ success: boolean; reason?: string }> {
    const response = await axios.post<{ success: boolean; reason?: string }>(
      `/api/orders/${orderId}/refund`,
      { amount, reason }
    );
    return response.data; // Return the refund result
  },
};

export default orderService;
