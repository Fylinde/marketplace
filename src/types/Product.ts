// src/types/Product.ts
export interface Product {
  id: string;
  title: string;
  price: number;
  imgUrl: string;
  category: string;
  images?: string[]; // Optional array for multiple images
  brand?: string;     // Optional brand property
  stock?: boolean;    // Optional stock availability flag
  stockCount?: number; // Optional stock count for available quantity
  vendorId?: string;  // Optional vendor ID for linking to vendor profile
  vendorName?: string; // Optional vendor name
}
