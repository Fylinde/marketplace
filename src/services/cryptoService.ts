import axios from "axios";

const cryptoService = {
  // Fetch supported wallets
  getWallets: async (): Promise<{ name: string; address: string; connected: boolean }[]> => {
    const response = await axios.get("/api/crypto/wallets");
    return response.data;
  },

  // Fetch crypto exchange rates
  getExchangeRates: async (): Promise<Record<string, number>> => {
    const response = await axios.get("/api/crypto/exchange-rates");
    return response.data.rates;
  },

  // Process crypto payment
  processPayment: async ({
    orderId,
    buyerCryptoAmount,
    sellerFiatAmount,
    cryptoCurrency,
    fiatCurrency,
  }: {
    orderId: string;
    buyerCryptoAmount: number;
    sellerFiatAmount: number;
    cryptoCurrency: string;
    fiatCurrency: string;
  }): Promise<any> => {
    const response = await axios.post("/api/crypto/payments", {
      orderId,
      buyerCryptoAmount,
      sellerFiatAmount,
      cryptoCurrency,
      fiatCurrency,
    });
    return response.data;
  },
};

export default cryptoService;
