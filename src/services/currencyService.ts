import axios from "axios";

const currencyService = {
  // Fetch exchange rates
  getExchangeRates: async (): Promise<{
    baseCurrency: string;
    rates: Record<string, number>;
  }> => {
    const response = await axios.get("/api/exchange-rates");
    return response.data;
  },

  // Lock exchange rate
  lockExchangeRate: async (
    fromCurrency: string,
    toCurrency: string
  ): Promise<{ rate: number; expiresAt: string }> => {
    const response = await axios.post("/api/exchange-rates/lock", {
      fromCurrency,
      toCurrency,
    });
    return response.data;
  },

  // Calculate conversion fees
  calculateConversionFee: async (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<{ conversionFee: number }> => {
    const response = await axios.post("/api/fees", {
      amount,
      fromCurrency,
      toCurrency,
    });
    return response.data;
  },

    // Update seller currency
    updateSellerCurrency: async (currency: string): Promise<any> => {
      try {
        const response = await axios.post("/api/currency/update-seller", { currency });
        return response.data; // Assuming the API returns the updated seller currency
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update seller currency.");
      }
    },
};

export default currencyService;
