// transactionService.ts
import axios from "../redux/slices/utils/axiosSetup";

const BASE_URL = "/api/transactions";

const transactionService = {
  getTransactionDetails: async (transactionId: string) => {
    const response = await axios.get(`${BASE_URL}/${transactionId}`);
    return response.data;
  },

  /**
* Fetch transaction history.
* @param {string} userId - The ID of the user for whom to fetch the transactions.
* @returns {Promise<any>} A promise that resolves to the transaction history data.
*/
  fetchTransactionHistory: async (userId: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/history`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw new Error("Failed to fetch transaction history");
    }
  },
};

export default transactionService;
