import axios from "axios";
import { Shop } from "../types/shop";
import { Product } from "../types/Product";


const API_BASE_URL = "/api/shop";



export interface CreateShopPayload {
  name: string;
  description: string;
  logo?: File;
}

export const fetchShops = async (): Promise<Shop[]> => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data;
};

export const fetchShopById = async (shopId: string): Promise<Shop> => {
  const response = await axios.get(`${API_BASE_URL}/${shopId}`);
  return response.data;
};

export const createShop = async (shopData: CreateShopPayload): Promise<Shop> => {
  const formData = new FormData();
  formData.append("name", shopData.name);
  formData.append("description", shopData.description);
  if (shopData.logo) formData.append("logo", shopData.logo);

  const response = await axios.post(`${API_BASE_URL}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateShop = async (shopId: string, shopData: Partial<CreateShopPayload>): Promise<Shop> => {
  const response = await axios.put(`${API_BASE_URL}/update/${shopId}`, shopData);
  return response.data;
};

export const deleteShop = async (shopId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/delete/${shopId}`);
};

export const addProductToShop = async (shopId: string, productData: Product): Promise<Product> => {
  const response = await axios.post(`${API_BASE_URL}/${shopId}/product/add`, productData);
  return response.data;
};

export const fetchAIRecommendations = async (shopId: string): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/${shopId}/ai-recommendations`);
  return response.data;
};
