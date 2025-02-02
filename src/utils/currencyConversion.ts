import { ExchangeRate } from "../types/ExchangeRate";

/**
 * Converts an amount from one currency to another using the provided exchange rate data.
 *
 * @param amount - The amount of money to convert.
 * @param fromCurrency - The currency code of the source amount.
 * @param toCurrency - The currency code of the target amount.
 * @param exchangeRate - An object containing the base currency and exchange rates.
 * @returns The converted amount, or the original amount if conversion fails.
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: ExchangeRate | null,
  precision: number = 2 // Default precision
): number => {
  if (!exchangeRate) {
    console.error("Exchange rate data is unavailable.");
    return parseFloat(amount.toFixed(precision));
  }

  const { baseCurrency, rates } = exchangeRate;

  // Fallback for matching currencies or missing rates
  if (fromCurrency === toCurrency) return parseFloat(amount.toFixed(precision));
  const fromRate = fromCurrency === baseCurrency ? 1 : rates[fromCurrency] || 0;
  const toRate = toCurrency === baseCurrency ? 1 : rates[toCurrency] || 0;

  // Handle missing rates
  if (fromRate === 0 || toRate === 0) {
    console.error(
      `Missing exchange rate for currencies: ${fromCurrency}, ${toCurrency}`
    );
    return parseFloat(amount.toFixed(precision));
  }

  // Perform conversion
  const convertedAmount = (amount / fromRate) * toRate;
  return parseFloat(convertedAmount.toFixed(precision));
};
