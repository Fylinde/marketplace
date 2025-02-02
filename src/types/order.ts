import { Product } from "./Product";
import { ExchangeRate } from "./ExchangeRate";
import { BillingAddress, ShippingAddress } from "./sharedTypes";

type Priority = "Normal" | "VIP" | "High" | string;

export interface Order {
  id: string;
  date: string;
  customerNote?: string;
  customerName: string;
  priority: Priority;
  proximity: number;
  deliverySpeed: "Fast" | "Normal";
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt?: string;
  paymentMethod: string;
  paymentId: string;
  paymentType: string;
  totalSellerPrice: number;
  totalBuyerPrice: number;
  price?: number;
  buyerPrice: number;
  sellerPrice: number;
  currency?: string;
  buyerCurrency: string;
  sellerCurrency: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled" | "Completed" | "Refunded";
  items: OrderItem[];
  deliveryOption?: DeliveryOption; // Single selected delivery option
  shippingAddress?: ShippingAddress[];
  billingAddress: BillingAddress[];
  estimatedDeliveryDate?: string;
  exchangeRates: ExchangeRate[];
  userId: string;
  products: OrderProduct[]; // Use OrderProduct[] to reference product IDs and quantities
}

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  date?: string; // Optional delivery date
  time?: string; // Optional delivery time
}

export interface OrderItem {
  productId: string;
  productName?: string;
  name?: string; // Fallback for name
  quantity: number;
  price?: number;
  buyerPrice?: number; // Add this
  sellerPrice?: number; // Add this
  discount?: number; // Optional discount percentage
  taxRate?: number; // Optional tax rate percentage
}
