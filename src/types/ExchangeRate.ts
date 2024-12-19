export interface ExchangeRate {
    baseCurrency: string;
    rates: Record<string, number>;
    updatedAt?: string; // Optional field for flexibility
  }
  