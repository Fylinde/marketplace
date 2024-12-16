// src/services/serviceService.ts
import axios from 'axios';
import { Service } from '@/types/Service'; // Define a type for services

const API_URL = '/api/services'; // Replace with your HandyMan microservice API endpoint

const serviceService = {
  // Fetch all services
  async fetchServices(params: Record<string, any> = {}): Promise<Service[]> {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  // Fetch a specific service by ID
  async fetchServiceById(serviceId: string): Promise<Service> {
    const response = await axios.get(`${API_URL}/${serviceId}`);
    return response.data;
  },

  // Create a new service (e.g., create a HandyMan job listing)
  async createService(serviceData: Service): Promise<Service> {
    const response = await axios.post(API_URL, serviceData);
    return response.data;
  },

  // Update an existing service
  async updateService(serviceId: string, serviceData: Partial<Service>): Promise<Service> {
    const response = await axios.put(`${API_URL}/${serviceId}`, serviceData);
    return response.data;
  },

  // Delete a service
  async deleteService(serviceId: string): Promise<void> {
    await axios.delete(`${API_URL}/${serviceId}`);
  },
};

export default serviceService;
