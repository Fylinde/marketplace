// src/types/Product.ts
export interface Product {
  id: string | number;
  name: string;
  imgUrl: string;
  currency: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
  createdAt: string;
  status?: string;
  rating?: Rating;
  category?: string;
  brand?: string;
  stock?: number;
  stockCount?: number;
  vendorId?: string;
  vendorName?: string;
  relatedProductIds?: string[];
  [key: string]: any;
}

export interface ProductResponse {
  products: Product[];
  totalPages: number;
}

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  date?: string;
}

interface Rating {
  average: number;
  count: number;
  reviews: Review[];
}

