export interface Recommendation {
    id: string | number;
    images: string[];
    buyerPrice: number;
    buyerCurrency: string;
    sellerPrice: number;
    sellerCurrency: string;
    stock: number;
    brand?: string;
    productId: string;
    name?: string; // Optional property
    currentPrice?: number;
    suggestedPrice?: number;
    suggestedDiscount?: number;
    reason?: string;
    type: 'price' | 'discount' | 'marketing' | 'buyer-focused';
    imageUrl?: string; // Optional, as it might not exist for all types
    price?: number; // Optional for price-related recommendations
    currency?: string; // Optional for price-related recommendations
    currentDiscount?: number;
    title?: string;
    description?: string;
    expectedROI?: string;  
}
  
