
import axios from "axios";
import { Order } from "../types/order";

const BASE_API_URL = "/api/orders";

const orderService = {
  /**
   * Fetch all orders with optional filters for buyer/seller pricing and currencies.
   */
  async getOrders(
    filters?: { buyerCurrency?: string; sellerCurrency?: string }
  ): Promise<Order[]> {
    const response = await axios.get<Order[]>(`${BASE_API_URL}`, {
      params: filters,
    });
    return response.data;
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
   * Place a new order with dual pricing details.
   */
  async placeOrder(orderData: {
    buyerPrice: number;
    sellerPrice: number;
    totalBuyerPrice: number;
    totalSellerPrice: number;
    buyerCurrency: string;
    sellerCurrency: string;
    items: { productId: string; quantity: number }[];
    shippingAddressId: string;
    billingAddressId: string;
  }): Promise<Order> {
    const response = await axios.post<Order>(
      `${BASE_API_URL}/place-order`,
      orderData
    );
    return response.data;
  },

  async estimateDelivery(orderId: string): Promise<{ estimatedDeliveryDate: string }> {
    const response = await axios.get<{ estimatedDeliveryDate: string }>(
      `${BASE_API_URL}/${orderId}/delivery-estimate`
    );
    return response.data;
  },

 /**
   * Update the status of a specific order.
   */
 async updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<Order> {
  const response = await axios.patch<Order>(
    `${BASE_API_URL}/${orderId}/status`,
    { status }
  );
  return response.data;
},


  /**
   * Fetch order history for both buyer and seller.
   */
  async getOrderHistory(page = 1, filters = {}) {
    const response = await axios.get(`/api/orders/history`, {
      params: { page, ...filters },
    });
    return response.data;
  },
  

  /**
   * Process a refund for a specific order with dual pricing details.
   */
  async processRefund(
    orderId: string,
    amount: { buyerAmount: number; sellerAmount: number },
    reason: string
  ): Promise<{ success: boolean; reason?: string }> {
    const response = await axios.post<{ success: boolean; reason?: string }>(
      `${BASE_API_URL}/${orderId}/refund`,
      { amount, reason }
    );
    return response.data;
  },

    /**
   * Fetch dual-price breakdown for an order.
   */
    async fetchPriceBreakdown(orderId: string): Promise<{
      buyerTotal: number;
      sellerTotal: number;
      taxes: number;
      fees: number;
    }> {
      const response = await axios.get<{
        buyerTotal: number;
        sellerTotal: number;
        taxes: number;
        fees: number;
      }>(`${BASE_API_URL}/${orderId}/price-breakdown`);
      return response.data;
    },
  

  /**
   * Fetch detailed information about a specific order.
   * @param orderId The ID of the order to fetch.
   * @returns A Promise resolving to the Order details.
   */
  async fetchOrderDetails(orderId: string): Promise<Order> {
    const response = await axios.get<Order>(`/api/orders/${orderId}`);
    return response.data; // Return the order details
  },

  /**
   * Request a refund for a specific order.
   * @param orderId The ID of the order to refund.
   * @param reason The reason for the refund request.
   * @returns A Promise resolving to a confirmation message or status.
   */
  async requestRefund(orderId: string, reason: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(`/api/orders/${orderId}/refund`, {
      reason,
    });
    return response.data; // Return the confirmation message
  },
};

export default orderService;
