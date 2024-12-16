import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Initial delay in ms

export const fetch3DAsset = async (productId: number): Promise<string> => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await axios.get(`/api/products/${productId}/3d-asset`);
      if (response.status === 200) {
        return response.data.assetUrl;
      }
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error: any) {
      attempt += 1;

      // Retry logic for network errors or 500s
      if (attempt < MAX_RETRIES && (error.response?.status === 500 || !error.response)) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * attempt)); // Exponential backoff
      } else {
        throw new Error(error.response?.data?.message || "Failed to fetch 3D asset");
      }
    }
  }

  throw new Error("Max retries reached. Unable to fetch 3D asset.");
};


/**
 * Fetch try-on data for a product.
 * @param productId - ID of the product to fetch try-on data for.
 * @returns Promise resolving to the try-on data.
 */
export const getTryOnData = async (productId: string): Promise<{ tryOnData: any }> => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await axios.get(`/api/products/${productId}/try-on`);
      if (response.status === 200) {
        return response.data; // Assuming response contains the `tryOnData` field
      }
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error: any) {
      attempt += 1;

      // Retry logic for network errors or server errors (5xx)
      if (attempt < MAX_RETRIES && (error.response?.status === 500 || !error.response)) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * attempt)); // Exponential backoff
      } else {
        throw new Error(error.response?.data?.message || "Failed to fetch try-on data");
      }
    }
  }
  throw new Error("Max retries reached. Unable to fetch try-on data.");
};