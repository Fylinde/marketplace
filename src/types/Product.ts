// src/types/Product.ts
import { Rating } from "./rating";

export interface Product {
  id: string; // Unique identifier, always required
  name: string; // Product name, essential for display
  
  sellerPrice: number;
  sellerCurrency: string
  totalSellerPrice: number;
  buyerPrice: number;
  buyerCurrency: string;
  totalBuyerPrice: number;
  
  createdAt: string; // Creation timestamp, important for auditing
  stock: number; // Current stock level, mandatory to manage inventory



  // Optional Fields
  imgUrl?: string; // Thumbnail or primary image for the product
  title?: string; // Secondary title for additional product context
  images?: string[]; // Array of images for product gallery
  description?: string; // Detailed product description
  status?: string; // Availability status (e.g., "In Stock", "Out of Stock")
  rating?: Rating | number; // Update to support both object and numeric ratings
  category?: string; // Product category for classification
  brand?: string; // Brand associated with the product
  stockCount?: number; // For finer-grained stock detail (e.g., sizes/colors)
  sellerId?: string; // Vendor ID, useful for marketplace platforms
  sellerName?: string; // Vendor name, supplementary for display
  relatedProductIds?: string[]; // IDs of related products for recommendations
  [key: string]: any; // Allow extensibility for additional fields
  
}


export interface ProductResponse {
  products: Product[]; // List of products in the response
  totalPages: number; // Total pages for paginated responses
}








