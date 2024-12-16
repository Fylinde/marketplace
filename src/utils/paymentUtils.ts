// paymentUtils.ts

/**
 * Shared utility functions for handling payment operations, including
 * currency conversion, partial payments, and crypto-to-fiat conversions.
 */

interface CurrencyConversionParams {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    exchangeRates: Record<string, number>; // Map of exchange rates
  }
  
  interface PartialPaymentParams {
    totalAmount: number;
    paymentBreakdown: Array<{
      method: string; // e.g., "crypto", "credit_card"
      amount: number;
      currency: string;
    }>;
  }
  
  interface PartialPaymentValidationResult {
    isValid: boolean;
    remainingAmount?: number; // If payments are insufficient
    excessAmount?: number; // If payments exceed the total
  }
  
  interface CryptoFiatConversionParams {
    cryptoAmount: number;
    cryptoCurrency: string;
    fiatCurrency: string;
    exchangeRates: Record<string, number>;
  }
  
  const paymentUtils = {
    /**
     * Section: Currency Conversion
     */
  
    /**
     * Converts an amount from one currency to another using exchange rates.
     * Applicable to both buyers and sellers for consistent pricing.
     */
    convertCurrency({
      amount,
      fromCurrency,
      toCurrency,
      exchangeRates,
    }: CurrencyConversionParams): number {
      if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        throw new Error("Invalid currency or missing exchange rate.");
      }
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      return amount * rate;
    },
  
    /**
     * Section: Partial Payments
     */
  
    /**
     * Validates partial payments to ensure they cover the total amount.
     * Useful for buyers splitting payments across multiple methods.
     */
    validatePartialPayments({
      totalAmount,
      paymentBreakdown,
    }: PartialPaymentParams): PartialPaymentValidationResult {
      const totalPaid = paymentBreakdown.reduce((sum, payment) => sum + payment.amount, 0);
  
      if (totalPaid < totalAmount) {
        return {
          isValid: false,
          remainingAmount: totalAmount - totalPaid,
        };
      } else if (totalPaid > totalAmount) {
        return {
          isValid: false,
          excessAmount: totalPaid - totalAmount,
        };
      }
  
      return { isValid: true };
    },
  
    /**
     * Splits a total amount across multiple payment methods.
     * Useful for buyers when combining multiple payment methods (e.g., crypto and credit card).
     */
    splitPayment({
      totalAmount,
      paymentBreakdown,
    }: PartialPaymentParams): Array<{ method: string; amount: number }> {
      const remainingAmount = totalAmount;
      const adjustedBreakdown = paymentBreakdown.map((payment) => {
        const proportion = payment.amount / totalAmount;
        const adjustedAmount = remainingAmount * proportion;
        return { method: payment.method, amount: adjustedAmount };
      });
  
      return adjustedBreakdown;
    },
  
    /**
     * Section: Crypto to Fiat Conversion
     */
  
    /**
     * Converts cryptocurrency to fiat currency using exchange rates.
     * Useful for sellers who prefer fiat payments but accept crypto.
     */
    convertCryptoToFiat({
      cryptoAmount,
      cryptoCurrency,
      fiatCurrency,
      exchangeRates,
    }: CryptoFiatConversionParams): number {
      if (!exchangeRates[cryptoCurrency] || !exchangeRates[fiatCurrency]) {
        throw new Error("Invalid cryptocurrency or missing exchange rate.");
      }
      const rate = exchangeRates[fiatCurrency] / exchangeRates[cryptoCurrency];
      return cryptoAmount * rate;
    },
  };
  
  export default paymentUtils;
  