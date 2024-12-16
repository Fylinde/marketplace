import axios from "axios";

const exchangeRateService = {
  // Fetch current exchange rates
  getCurrentExchangeRates: async (): Promise<{
    baseCurrency: string;
    rates: Record<string, number>;
    updatedAt: string;
  }> => {
    const response = await axios.get("/api/exchange-rates");
    return {
      baseCurrency: response.data.base,
      rates: response.data.rates,
      updatedAt: response.data.date,
    };
  },

  // Fetch historical exchange rates
  getHistoricalExchangeRates: async (date: string): Promise<{
    date: string;
    rates: Record<string, number>;
  }> => {
    const response = await axios.get(`/api/exchange-rates/history/${date}`);
    return {
      date,
      rates: response.data.rates,
    };
  },
};

export default exchangeRateService;
