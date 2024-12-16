// src/types/shop.ts

export interface Shop {
  id: string;
  imgUrl: string;
  name: string;
  products: string[]; // Add this field to represent product associations
}
