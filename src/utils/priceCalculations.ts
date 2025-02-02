import { convertCurrency } from "./currencyConversion";
import { ExchangeRate } from "../types/ExchangeRate";

interface PriceCalculationParams {
  items: Array<{
    sellerPrice: number; // Price in seller's currency
    quantity: number; // Number of units purchased
    discount?: number; // Percentage discount (e.g., 10 for 10%)
    taxRate?: number; // Tax percentage
    lockedExchangeRate?: number; // Optional locked exchange rate for this item's currency
  }>;
  shippingCost?: number; // Shipping cost for the order
  exchangeRate: ExchangeRate | null; // Exchange rate data for conversion
  buyerCurrency: string; // Target currency for buyer
  sellerCurrency: string; // Source currency for seller
}

interface PriceCalculationResult {
  totalBuyerPrice: number; // Total price buyers pay before discount and tax
  totalSellerPrice: number; // Total revenue for sellers
  totalTax: number; // Total tax amount applied
  totalDiscount: number; // Total discount amount applied
  totalWithShipping: number; // Final amount after applying shipping, discount, and tax
}

const priceCalculation = {
  calculate(params: PriceCalculationParams): PriceCalculationResult {
    const { items, shippingCost = 0, exchangeRate, buyerCurrency, sellerCurrency } = params;

    let totalBuyerPrice = 0;
    let totalSellerPrice = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    items.forEach((item) => {
      // Use locked exchange rate or calculate dynamically
      const exchangeRateForItem =
        item.lockedExchangeRate ??
        convertCurrency(1, sellerCurrency, buyerCurrency, exchangeRate);

      // Calculate seller and buyer prices
      const sellerPrice = item.sellerPrice * item.quantity;
      const buyerPrice = sellerPrice * exchangeRateForItem;

      // Calculate discounts and taxes
      const discount = item.discount ? (buyerPrice * item.discount) / 100 : 0;
      const taxableAmount = buyerPrice - discount;
      const tax = item.taxRate ? (taxableAmount * item.taxRate) / 100 : 0;

      // Accumulate totals
      totalSellerPrice += sellerPrice;
      totalBuyerPrice += buyerPrice;
      totalDiscount += discount;
      totalTax += tax;
    });

    // Final total cost for buyers, including shipping, taxes, and discounts
    const totalWithShipping = totalBuyerPrice - totalDiscount + totalTax + shippingCost;

    return {
      totalBuyerPrice,
      totalSellerPrice,
      totalTax,
      totalDiscount,
      totalWithShipping,
    };
  },
};

export default priceCalculation;
