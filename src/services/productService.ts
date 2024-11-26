// src/api/productService.ts
import axios from "axios";
import { ProductResponse } from "@/types/Product";

// Base URL for the product microservice API
const API_URL = "https://api.example.com/products"; // Replace with your actual API endpoint
const CATEGORY_URL = "https://api.example.com/categories"; // Endpoint for categories
const TAG_URL = "https://api.example.com/tags"; // Endpoint for tags

// Fetch all products, potentially filtered by vendor if needed
export const getProducts = async (
  vendorId?: string,
  page: number = 1,
  filters: Record<string, any> = {},
  sort: string = "popularity"
): Promise<ProductResponse> => {
  const params = { vendorId, page, ...filters, sort };
  const response = await axios.get("/api/products", { params });
  return response.data;
};



// Fetch TryOn Data
export const getTryOnData = (productId: string) => {
  return axios.get(`${API_URL}/${productId}/tryon`);
};

// Fetch Localized Pricing
export const getLocalizedPricing = (productId: string, currency: string) => {
  return axios.get(`${API_URL}/${productId}/price`, { params: { currency } });
};

// Fetch comments for a specific product
export const getComments = (productId: string) => {
  return axios.get(`${API_URL}/${productId}/comments`);
};

// Add a comment to a specific product
export const addComment = (productId: string, commentData: { rating: number; comment: string }) => {
  return axios.post(`${API_URL}/${productId}/comments`, commentData);
};

// Create a new product
export const createProduct = (productData: any) => {
  return axios.post(API_URL, productData);
};

// Update an existing product
export const updateProduct = (productId: string, productData: any) => {
  return axios.put(`${API_URL}/${productId}`, productData);
};

// Delete a product
export const deleteProduct = (productId: string) => {
  return axios.delete(`${API_URL}/${productId}`);
};

// Fetch related products based on the product ID
export const getRelatedProducts = (productId: string) => {
  return axios.get(`${API_URL}/${productId}/related`);
};

// Fetch product ratings by productId
export const getProductRating = (productId: string) => {
  return axios.get(`${API_URL}/${productId}/ratings`);
};

// Add a new rating for a product
export const addProductRating = (productId: string, ratingData: any) => {
  return axios.post(`${API_URL}/${productId}/ratings`, ratingData);
};

// Fetch categories for products
export const fetchCategories = () => {
  return axios.get(CATEGORY_URL).then((response) => response.data);
};

// Fetch tags for products
export const fetchTags = () => {
  return axios.get(TAG_URL).then((response) => response.data);
};
