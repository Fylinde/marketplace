import { Product } from "./Product";

export interface Order {
  id: string;
  date: string;
  products: Product[];
  shippingAddress: string;
  customerNote?: string;
  customerName: string;
  priority: string;
  proximity: number;
  deliverySpeed: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentId: string;
  paymentType: string;
  totalAmount: number;
  currency: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}
