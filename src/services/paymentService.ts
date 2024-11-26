import axiosInstance from "redux/slices/axiosSetup";
import { PaymentMethod } from "@/types/sharedTypes";

const paymentService = {
  // Fetch all payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await axiosInstance.get("/api/payment-methods");
    return response.data; // Ensure the API response matches the PaymentMethod[]
  },
  createPaymentMethod: async (method: PaymentMethod): Promise<PaymentMethod> => {
    const response = await axiosInstance.post("/api/payment-methods", method);
    return response.data; // Return a single PaymentMethod
  },
  updatePaymentMethod: async ({
    id,
    updates,
  }: {
    id: string;
    updates: Partial<PaymentMethod>;
  }): Promise<PaymentMethod> => {
    const response = await axiosInstance.put(`/api/payment-methods/${id}`, updates);
    return response.data; // Return the updated PaymentMethod
  },
  deletePaymentMethod: async (id: string): Promise<string> => {
    await axiosInstance.delete(`/api/payment-methods/${id}`);
    return id; // Return the deleted payment method ID
  },
  refundPayment: async (paymentId: string, currency: string): Promise<{ success: boolean; reason?: string }> => {
    const response = await axiosInstance.post(`/api/refund/${paymentId}`, { currency });
    return response.data;
  },

  // Fetch escrow transactions
  getEscrowTransactions: async (): Promise<any[]> => {
    return await axiosInstance.get("/api/escrow-transactions").then((res) => res.data);
  },

  // Toggle crypto acceptance
  toggleCryptoAcceptance: async (): Promise<{ cryptoAcceptance: boolean }> => {
    return await axiosInstance.post("/api/crypto/toggle-acceptance").then((res) => res.data);
  },

  // Fetch exchange rates
  getExchangeRates: async (): Promise<Record<string, number>> => {
    return await axiosInstance.get("/api/exchange-rates").then((res) => res.data.rates);
  },


  // Update seller currency
  updateSellerCurrency: async (currency: string): Promise<string> => {
    return await axiosInstance.put("/api/seller/currency", { currency }).then((res) => res.data);
    },
};
    


export default paymentService;
