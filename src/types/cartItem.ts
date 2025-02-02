import { ExchangeRate } from "./ExchangeRate";

export interface CartItem {
    id: string;
    productId: string; // Add productId
    name: string;
    sellerPrice: number; // Original price in seller's currency
    sellerCurrency: string;
    totalSellerPrice: number;
    buyerPrice: number; // Converted price in buyer's currency
    buyerCurrency: string;
    totalBuyerPrice: number;
    quantity: number;
    image: string;
    stock: number;
    sellerId?: string;
    category?: string;
    discount?: number;
    isTryOnEnabled?: boolean; // Visual TryOn feature
    escrow?: boolean; // Escrow-enabled item
    taxRate?: number; // Add this if needed
    imgUrl?: string;
    exchangeRate?: ExchangeRate;
    lockedExchangeRate?: number;
  }