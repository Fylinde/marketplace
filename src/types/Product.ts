// src/types/Product.ts
import { Rating } from "./rating";

export interface Product {
  id: string; // Unique identifier, always required
  name: string; // Product name, essential for display
  sellerPrice: number; // Price offered by the seller
  sellerCurrency: string; // Seller's currency
  totalSellerPrice: number; // Total seller price, including taxes and fees
  buyerPrice: number; // Price for buyers
  buyerCurrency: string; // Buyer's currency
  totalBuyerPrice: number; // Total buyer price, including taxes and fees
  createdAt: string; // Creation timestamp, important for auditing
  stock: number; // Current stock level, mandatory to manage inventory
  mock: boolean;

  
  // Optional Fields
  imgUrl?: string; // Thumbnail or primary image for the product
  title?: string; // Secondary title for additional product context
  images?: string[]; // Array of images for product gallery
  videos?: string[]; // Array of product videos for interactive experiences
  description?: string; // Detailed product description
  longDescription?: string; // Comprehensive product details
  features?: string[]; // List of key product features
  specifications?: Record<string, string | number>; // Technical specs (e.g., weight, dimensions)
  status?: "inStock" | "outOfStock" | "preOrder" | "discontinued"; // Availability status
  rating?: Rating | number; // Update to support both object and numeric ratings
  category?: string; // Product category for classification
  subCategory?: string; // Subcategory for better organization
  brand?: string; // Brand associated with the product
  model?: string; // Model name/number
  tags?: string[]; // Tags for product discoverability
  stockCount?: number; // For finer-grained stock detail (e.g., sizes/colors)
  sellerId?: string; // Seller ID, useful for marketplace platforms
  sellerName?: string; // Seller name, supplementary for display
  sellerRating?: Rating | number; // Rating for the seller
  relatedProductIds?: string[]; // IDs of related products for recommendations
  warranty?: string; // Warranty details
  returnPolicy?: string; // Return policy for the product
  ecoFriendly?: boolean; // Indicates if the product is eco-friendly
  certifications?: string[]; // Certifications (e.g., "ISO 9001", "Organic")
  customizable?: boolean; // Indicates if the product can be customized
  preorderAvailable?: boolean; // Indicates if the product is available for pre-order
  preorderReleaseDate?: string; // Release date for pre-ordered items
  bulkPricing?: { quantity: number; price: number }[]; // Pricing for bulk purchases
  compatibility?: string[]; // Compatible items (e.g., accessories, devices)
  flashDeals?: Product[]; 
  [key: string]: any; // Allow extensibility for additional fields
  aiTags?: string[];
}

export interface ProductResponse {
  products: Product[]; // List of products in the response
  data: Product[];
  total: number;
  currentPage: number;
  totalPages: number;

}



export interface ProductFilters {
  // Core filters
  context: "B2B" | "B2C" | "C2C" | null; // Business contexts
  buyerPrice: [number, number]; // Price range for buyers
  sellerPrice: [number, number]; // Price range for sellers
  availability: "inStock" | "outOfStock" | "preOrder" | "discontinued" | null; // Stock status
  selectedCategories: string[]; // Categories for product filtering

  // Additional standard e-commerce filters
  tags?: string[]; // Tags to filter products by specific features (e.g., "Sale", "New Arrival")
  rating?: [number, number]; // Minimum and maximum rating (e.g., 3 to 5 stars)
  brand?: string[]; // Filter by brands
  color?: string[]; // Filter by colors
  size?: string[]; // Filter by sizes (e.g., S, M, L, XL for clothing)
  material?: string[]; // Filter by materials (e.g., cotton, leather)
  sellerLocation?: string; // Location-based filtering (e.g., "USA", "Europe")
  shippingOptions?: string[]; // Shipping options (e.g., "Free Shipping", "Express Delivery")
  condition?: "new" | "used" | "refurbished" | null; // Product condition
  certifications?: string[]; // Filter by certifications (e.g., "ISO 9001", "Organic")
  warranty?: boolean; // Whether products have warranty
  customizable?: boolean; // Filter for customizable products
  ecoFriendly?: boolean; // Filter for eco-friendly products

  // Advanced filters
  discountRange?: [number, number]; // Discount range (e.g., 10% to 50%)
  popularity?: "lowToHigh" | "highToLow" | null; // Popularity sorting
  sortBy?: "price" | "popularity" | "rating" | "newest" | "relevance"; // Sorting criteria
  bulkPricingAvailable?: boolean; // Filter for bulk pricing availability
  compatibleWith?: string; // Filter for compatibility with a specific device/item
  sellerRating?: [number, number]; // Filter by seller rating

  // Search and metadata
  searchTerm?: string; // Free text search
  metadata?: Record<string, any>; // Extendable metadata for custom filters

  segment?: string; // Segments (e.g., "B2B", "B2C", "C2C")
  [key: string]: any; // Allow extensibility for dynamic or custom filters
}

export const defaultFilters: ProductFilters = {
  context: null,
  buyerPrice: [0, Infinity],
  sellerPrice: [0, Infinity],
  availability: null,
  selectedCategories: [],
  tags: [],
  rating: [0, 5],
  brand: [],
  color: [],
  size: [],
  material: [],
  sellerLocation: "",
  shippingOptions: [],
  condition: null,
  certifications: [],
  discountRange: [0, 100],
  popularity: null,
  sortBy: "popularity",
  searchTerm: "",
  sellerRating: [0, 5],
  bulkPricingAvailable: false,
  customizable: false,
  ecoFriendly: false,

};

