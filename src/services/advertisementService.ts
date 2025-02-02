import axios from "axios";
import { Product } from "../types/Product"; // Assuming advertisements use the Product type

export const fetchAdvertisementsAPI = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>("/api/advertisements");
  return response.data;
};
