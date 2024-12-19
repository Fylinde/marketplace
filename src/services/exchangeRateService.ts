import axios from "axios";
import { HistoricalRate } from "../redux/slices/utils/exchangeRateSlice";


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

  // Fetch historical exchange rates for a date range
  getHistoricalExchangeRates: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<HistoricalRate[]> => {
    const response = await axios.get(`/api/exchange-rates/history`, {
      params: { startDate, endDate },
    });
    return response.data; // Assumes API returns an array of HistoricalRate
  },

  // Convert currency
  convertCurrency: async (payload: { amount: number; from: string; to: string }): Promise<{
    from: string;
    to: string;
    amount: number;
    result: number;
  }> => {
    const response = await axios.post("/api/exchange-rates/convert", payload);
    return {
      from: payload.from,
      to: payload.to,
      amount: payload.amount,
      result: response.data.result, // Assuming backend returns a `result` field
    };
  },
};

export default exchangeRateService;
