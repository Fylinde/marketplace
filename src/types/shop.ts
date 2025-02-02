// Represents a shop entity in a marketplace
import { Product } from "./Product";

export interface Shop {
  id: string;
  imgUrl: string;
  name: string;
  description: string;
  logo: string;
  ownerId: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

// Represents detailed shop setup information for registration
export interface ShopDetails {
  storeName: string;
  productCategories: string[];
  businessAddress: string;
  shippingDetails: string;
  returnPolicy: string;
  upc: string;
  manufacturerBrandOwner: string;
  trademarkOwnership: string;
}

// Represents store-specific data, potentially for branding or inventory
export interface StoreData {
  storeName: string;
  upc: string;
  manufacturerBrandOwner: string;
  trademarkOwnership: string;
}

// Represents store-specific information in a different context (e.g., legal)
export interface StoreInformation {
  storeName: string;
  upc: string;
  manufacturerBrandOwner: string;
  trademarkOwnership: string;
}
