// src/api/productService.ts
import axios from "axios";

// Base URL for the product microservice API
const API_URL = "https://api.example.com/products"; // Replace with your actual API endpoint

// Fetch all products, potentially filtered by vendor if needed
export const getProducts = (vendorId?: string, page: number = 1) => {
  return axios.get(API_URL, { params: { vendorId, page } });
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