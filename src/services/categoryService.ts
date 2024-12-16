// src/services/categoryService.ts
import axios from 'axios';
import { Category } from '../types/category'; // Assuming you have a Category type defined

const API_URL = '/api/categories'; // Replace with actual API endpoint

// Modular category service with enhanced error handling
const categoryService = {
  async fetchCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch categories');
    }
  },

  async fetchCategoryById(categoryId: string): Promise<Category> {
    try {
      const response = await axios.get(`${API_URL}/${categoryId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || `Failed to fetch category with ID ${categoryId}`);
    }
  },
};

export default categoryService;
