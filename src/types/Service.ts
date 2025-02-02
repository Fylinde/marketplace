// src/types/Service.ts

export interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    category: string;
    status: 'active' | 'inactive' | 'completed';
    images?: string[];
    createdAt: string;
    updatedAt?: string;
    sellerId: string; // The seller providing the service
    location?: string; // Optional: location of the service
    [key: string]: any; // Allow for flexible additional properties
  }
  