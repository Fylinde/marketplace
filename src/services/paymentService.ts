import axios from "axios";
import { PaymentMethod, PaymentDetails } from "../types/sharedTypes";
import { PaymentRecord } from "../redux/slices/orders/paymentSlice";
import { BankAccountVerification as BankAccountVerificationType } from "../types/sharedTypes";



const PAYMENT_SERVICE_BASE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:8013/api";
const VENDOR_SERVICE_BASE_URL = process.env.VENDOR_SERVICE_URL || "http://localhost:8012/sellers";







const paymentService = {
  // Fetch all payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await axios.get(`${PAYMENT_SERVICE_BASE_URL}/payment-methods`);
    return response.data;
  },

 // Create a new payment method
 createPaymentMethod: async (method: { type: string; details: any }): Promise<any> => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/payments/methods`, method);
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
    const response = await axios.put(`${PAYMENT_SERVICE_BASE_URL}/payment-methods/${id}`, updates);
    return response.data;
  },

  // Delete a payment method
  deletePaymentMethod: async (id: string): Promise<string> => {
    await axios.delete(`${PAYMENT_SERVICE_BASE_URL}/payment-methods/${id}`);
    return id;
    },
 setDefaultPaymentMethod: async (id: string): Promise<any> => {
        const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/payment-methods/${id}/set-default`);
        return response.data;
      },
 reorderPaymentMethods: async (updatedOrder: string[]): Promise<any> => {
        const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/payment-methods/reorder`, { updatedOrder });
        return response.data;
      },
setDefaultPayoutMethod: async (methodId: string): Promise<any> => {
        const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/payment-methods/${methodId}/set-default-payout`);
        return response.data;
      },
      
  // Create a transaction
  createTransaction: async (
    orderId: string,
    buyerCurrency: string,
    paymentBreakdown: { method: string; amount: number }[]
  ): Promise<any> => {
    const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/transactions`, {
      orderId,
      buyerCurrency,
      paymentBreakdown,
    });
    return response.data;
  },

  toggleCryptoAcceptance: async (acceptCrypto: boolean): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/toggle-crypto`, { acceptCrypto });
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
        const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/refund`, { paymentId, currency });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to process the refund.");
      }
    },
  
      // Fetch payment data
  fetchPaymentData: async (): Promise<any> => {
    try {
      const response = await axios.get(`${PAYMENT_SERVICE_BASE_URL}/data`);
      return response.data; // Assuming the API returns payment-related data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch payment data.");
    }
  },

  fetchRefundStatuses: async (): Promise<any[]> => {
    try {
      const response = await axios.get(`${PAYMENT_SERVICE_BASE_URL}/refunds`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching refund statuses:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch refund statuses"
      );
    }
  },

  fetchTransactionHistory: async () => {
    const response = await axios.get(`${PAYMENT_SERVICE_BASE_URL}/transactions`);
    return response.data;
  },

  fetchTransactionDetails: async (transactionId: string) => {
    const response = await axios.get(`${PAYMENT_SERVICE_BASE_URL}/transactions/${transactionId}`);
    return response.data;
  },


    /**
   * Fetch payment history
   * @returns {Promise<PaymentRecord[]>} List of payment records
   */
    getPaymentHistory: async (): Promise<PaymentRecord[]> => {
      const response = await axios.get(`${PAYMENT_SERVICE_BASE_URL}/history`);
      return response.data;
  },
    
    // In paymentService.ts
 fetchBillingHistory:  async (userId: string): Promise<any[]> => {
  // Replace with actual API call
  const response = await axios.get(`${PAYMENT_SERVICE_BASE_URL}/billingHistory/${userId}`);
  return response.data;
  },
 
 // In paymentService.ts
 processPayment: async (paymentDetails: PaymentDetails): Promise<void> => {
  // Replace with actual API call
  await axios.post(`${PAYMENT_SERVICE_BASE_URL}/processPayment`, paymentDetails);
  },
 

    
};


export const tokenizePaymentDetails = async (details: PaymentDetails): Promise<string> => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/tokenize-card`, details);
    return response.data.token;
  } catch (error) {
    console.error("Error tokenizing payment details:", error);
    throw new Error("Failed to tokenize payment details. Please try again.");
  }
};

export const saveBankAccountDetails = async (
  data: BankAccountVerificationType,
  proofFile: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("accountNumber", data.accountNumber);
  formData.append("bankName", data.bankName);
  formData.append("routingCode", data.routingCode);
  formData.append("proof", proofFile);
  
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  
  try {
    const response = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/tokenize-card`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.status; // Assume the response contains a `status` field
  } catch (error) {
    console.error("Error saving bank account details:", error);
    throw new Error("Failed to save bank account details. Please try again.");
  }
};

/**
 * Calls the vendor-service to resend a verification code for a seller.
 * @param email - The email of the seller to resend the code to.
 * @returns Success message from the backend.
 */
export const resendVerificationCode = async (email: string): Promise<string> => {
  try {
    const response = await axios.post(`${VENDOR_SERVICE_BASE_URL}/resend_verification_code`, {
      email, // Include email in the request body
    });
    return response.data.message; // Assume backend sends a success message in `message`
  } catch (error: any) {
    console.error("Error in resendVerificationCode API call:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to contact backend.");
  }
};


export default paymentService;
