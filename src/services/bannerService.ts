// src/services/bannerService.ts
import axios from 'axios';
import { Banner } from '../types/banner';

const API_URL = '/api/banners'; // Replace with actual API endpoint

const bannerService = {
  // Fetch all banners
  async getBanners(): Promise<Banner[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Fetch a specific banner by ID
  async getBannerById(bannerId: string): Promise<Banner> {
    const response = await axios.get(`${API_URL}/${bannerId}`);
    return response.data;
  },
};

export default bannerService;
