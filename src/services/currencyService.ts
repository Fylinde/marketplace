import axios from "axios";

// Fetch exchange rates
export const fetchExchangeRates = async () => {
  const response = await axios.get("/api/exchange-rates"); // Replace with your actual endpoint
  return response.data;
};

// Convert a price
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>
): number => {
  const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
  return amount * rate;
};
