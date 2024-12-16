interface PriceCalculationParams {
  items: Array<{
    sellerPrice: number; // Price in seller's currency
    quantity: number; // Number of units purchased
    discount?: number; // Percentage discount (e.g., 10 for 10%)
    taxRate?: number; // Tax percentage
    lockedExchangeRate?: number; // Locked exchange rate for this item's currency
  }>;
  shippingCost?: number; // Shipping cost for the order
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
    const { items, shippingCost = 0 } = params;

    let totalBuyerPrice = 0;
    let totalSellerPrice = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    items.forEach((item) => {
      // Use locked exchange rate or default to 1 if unavailable
      const exchangeRate = item.lockedExchangeRate || 1;

      // Calculate seller and buyer prices
      const sellerPrice = item.sellerPrice * item.quantity;
      const buyerPrice = sellerPrice * exchangeRate;

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
