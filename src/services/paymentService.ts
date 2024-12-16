import axios from "axios";
import { PaymentMethod, PaymentDetails } from "@/types/sharedTypes";
import { PaymentRecord } from "../redux/slices/orders/paymentSlice";


const BASE_URL = "/api/payments"; 

const paymentService = {
  // Fetch all payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await axios.get("/api/payment-methods");
    return response.data;
  },

 // Create a new payment method
 createPaymentMethod: async (method: { type: string; details: any }): Promise<any> => {
  try {
    const response = await axios.post("/api/payments/methods", method);
    return response.data; // Assuming the API returns the created payment method
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create payment method.");
  }
},


  // Update an existing payment method
  updatePaymentMethod: async ({
    id,
    updates,
  }: {
    id: string;
    updates: Partial<PaymentMethod>;
  }): Promise<PaymentMethod> => {
    const response = await axios.put(`/api/payment-methods/${id}`, updates);
    return response.data;
  },

  // Delete a payment method
  deletePaymentMethod: async (id: string): Promise<string> => {
    await axios.delete(`/api/payment-methods/${id}`);
    return id;
    },
 setDefaultPaymentMethod: async (id: string): Promise<any> => {
        const response = await axios.post(`/api/payment-methods/${id}/set-default`);
        return response.data;
      },
 reorderPaymentMethods: async (updatedOrder: string[]): Promise<any> => {
        const response = await axios.post(`/api/payment-methods/reorder`, { updatedOrder });
        return response.data;
      },
setDefaultPayoutMethod: async (methodId: string): Promise<any> => {
        const response = await axios.post(`/api/payment-methods/${methodId}/set-default-payout`);
        return response.data;
      },
      
  // Create a transaction
  createTransaction: async (
    orderId: string,
    buyerCurrency: string,
    paymentBreakdown: { method: string; amount: number }[]
  ): Promise<any> => {
    const response = await axios.post("/api/transactions", {
      orderId,
      buyerCurrency,
      paymentBreakdown,
    });
    return response.data;
  },

  toggleCryptoAcceptance: async (acceptCrypto: boolean): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post("/api/payment/toggle-crypto", { acceptCrypto });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to toggle cryptocurrency acceptance.");
    }
  },

    /**
   * Refund a payment
   * @param transactionId The ID of the transaction to refund
   * @returns A promise with the refund response
   */
    refundPayment: async ({ paymentId, currency }: { paymentId: string; currency: string }): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await axios.post(`/api/payments/refund`, { paymentId, currency });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to process the refund.");
      }
    },
  
      // Fetch payment data
  fetchPaymentData: async (): Promise<any> => {
    try {
      const response = await axios.get("/api/payments/data");
      return response.data; // Assuming the API returns payment-related data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch payment data.");
    }
  },

  fetchRefundStatuses: async (): Promise<any[]> => {
    try {
      const response = await axios.get("/api/refunds");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching refund statuses:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch refund statuses"
      );
    }
  },

  fetchTransactionHistory: async () => {
    const response = await axios.get("/api/transactions");
    return response.data;
  },

  fetchTransactionDetails: async (transactionId: string) => {
    const response = await axios.get(`/api/transactions/${transactionId}`);
    return response.data;
  },


    /**
   * Fetch payment history
   * @returns {Promise<PaymentRecord[]>} List of payment records
   */
    getPaymentHistory: async (): Promise<PaymentRecord[]> => {
      const response = await axios.get(`${BASE_URL}/history`);
      return response.data;
  },
    
    // In paymentService.ts
 fetchBillingHistory:  async (userId: string): Promise<any[]> => {
  // Replace with actual API call
  const response = await axios.get(`/api/billingHistory/${userId}`);
  return response.data;
  },
 
 // In paymentService.ts
 processPayment: async (paymentDetails: PaymentDetails): Promise<void> => {
  // Replace with actual API call
  await axios.post(`/api/processPayment`, paymentDetails);
},
    
};


export default paymentService;
