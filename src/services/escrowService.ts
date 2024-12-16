import axios from "axios";

const escrowService = {
  // Fetch all escrow transactions
  getEscrowTransactions: async (): Promise<any[]> => {
    const response = await axios.get("/api/escrow-transactions");
    return response.data;
  },

  // Create a new escrow transaction
  createEscrowTransaction: async ({
    orderId,
    buyerName,
    sellerName,
    amount,
    currency,
    releaseDate,
  }: {
    orderId: string;
    buyerName: string;
    sellerName: string;
    amount: number;
    currency: string;
    releaseDate: string;
  }): Promise<any> => {
    const response = await axios.post("/api/escrow-transactions", {
      orderId,
      buyerName,
      sellerName,
      amount,
      currency,
      releaseDate,
    });
    return response.data;
  },

  // Release escrow funds
  releaseFunds: async (transactionId: string): Promise<any> => {
    const response = await axios.post(`/api/escrow-transactions/${transactionId}/release`);
    return response.data;
  },

  // Submit evidence (add it here)
  submitEvidence: async (formData: FormData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post("/api/escrow/submit-evidence", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to submit evidence");
    }
  },

  // Dispute an escrow transaction
  disputeTransaction: async (transactionId: string, reason: string): Promise<any> => {
    const response = await axios.post(`/api/escrow-transactions/${transactionId}/dispute`, {
      reason,
    });
    return response.data;
  },

  // Fetch dispute details for a specific transaction
  fetchDisputeInfo: async (transactionId: string): Promise<any> => {
    const response = await axios.get(`/api/escrow/${transactionId}/dispute`);
    return response.data;
  },

  // Fetch the delivery timeline for a specific transaction
  fetchTimeline: async (transactionId: string): Promise<any> => {
    const response = await axios.get(`/api/escrow/${transactionId}/timeline`);
    return response.data;
  },
};



export default escrowService;
