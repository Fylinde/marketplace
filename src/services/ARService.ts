// src/services/ARService.ts

import axios from "axios";

const BASE_API_URL = "/api/ar"; // Base URL for AR-related API endpoints

interface ARModelData {
  productId: string;
  modelUrl: string;
  scale: number;
  rotation: { x: number; y: number; z: number };
  metadata: Record<string, any>;
}

const ARService = {
  /**
   * Fetch AR model data for a given product.
   * @param productId The ID of the product to fetch AR data for.
   * @returns AR model data including model URL, scale, and metadata.
   */
  async fetchARModel(productId: string): Promise<ARModelData> {
    const response = await axios.get<ARModelData>(`${BASE_API_URL}/models/${productId}`);
    return response.data;
  },

  /**
   * Fetch room scaling configuration for AR visualization.
   * @param userId The ID of the user (optional, for personalized scaling).
   * @returns Room scaling configuration (e.g., dimensions, environment settings).
   */
  async fetchRoomScaling(userId?: string): Promise<{ width: number; height: number; depth: number }> {
    const response = await axios.get<{ width: number; height: number; depth: number }>(
      `${BASE_API_URL}/room-scaling`,
      { params: { userId } }
    );
    return response.data;
  },

  /**
   * Upload custom AR assets for a product (for sellers or admins).
   * @param productId The ID of the product.
   * @param file The 3D model file to be uploaded.
   * @returns A confirmation message or status.
   */
  async uploadARAsset(productId: string, file: File): Promise<{ success: boolean; message: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<{ success: boolean; message: string }>(
      `${BASE_API_URL}/upload/${productId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * Get metadata for a given AR product model.
   * @param productId The ID of the product.
   * @returns Metadata related to the AR model (e.g., texture info, version).
   */
  async fetchARMetadata(productId: string): Promise<Record<string, any>> {
    const response = await axios.get<Record<string, any>>(`${BASE_API_URL}/metadata/${productId}`);
    return response.data;
  },

  /**
   * Log AR interaction metrics (e.g., view time, interactions, etc.).
   * @param data Metrics data to log.
   * @returns A confirmation message or status.
   */
  async logARInteractionMetrics(data: {
    productId: string;
    userId?: string;
    interactionType: string;
    duration?: number;
  }): Promise<{ success: boolean; message: string }> {
    const response = await axios.post<{ success: boolean; message: string }>(
      `${BASE_API_URL}/metrics`,
      data
    );
    return response.data;
  },
};

export default ARService;
