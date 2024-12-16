// src/services/searchService.ts
import axios from "axios";

const BASE_URL = "/api/search";

const searchService = {
  /**
   * Perform a semantic text-based search.
   * @param query - The text query.
   * @param filters - Optional filters for refining results.
   * @param language - User's preferred language.
   * @param currency - User's preferred currency.
   */
  async semanticSearch(query: string, filters = {}, language: string, currency: string) {
    const response = await axios.get(`${BASE_URL}/semantic`, {
      params: { query, language, currency, ...filters },
    });
    return response.data; // Return enriched semantic results.
  },

  /**
   * Perform a cross-modal search combining text and image.
   * @param query - Text query.
   * @param imageData - Image data (base64 or file blob).
   */
  async crossModalSearch(query: string, imageData: string) {
    const response = await axios.post(`${BASE_URL}/cross-modal`, {
      query,
      image: imageData,
    });
    return response.data; // Return cross-modal results.
  },

  /**
   * Perform an augmented reality (AR)-enabled search.
   * @param query - Search query (text or item ID).
   * @param environmentData - AR environment details.
   */
  async arSearch(query: string, environmentData: any) {
    const response = await axios.post(`${BASE_URL}/ar`, {
      query,
      environment: environmentData,
    });
    return response.data; // Return AR-optimized results.
  },

  /**
   * Fetch localized search results.
   * @param query - The text query.
   * @param region - User's region.
   * @param language - User's preferred language.
   */
  async localizedSearch(query: string, region: string, language: string) {
    const response = await axios.get(`${BASE_URL}/localized`, {
      params: { query, region, language },
    });
    return response.data; // Return localized results.
  },

  /**
   * Perform image-based try-on search.
   * @param imageData - User-uploaded image (base64 or file blob).
   * @param tryOnType - Type of try-on (e.g., clothing, glasses, etc.).
   */
  async visualTryOnSearch(imageData: string, tryOnType: string) {
    const response = await axios.post(`${BASE_URL}/try-on`, {
      image: imageData,
      type: tryOnType,
    });
    return response.data; // Return visual try-on compatible results.
  },

  /**
   * Fetch available advanced filters for a query.
   */
  async getAvailableFilters() {
    const response = await axios.get(`${BASE_URL}/filters`);
    return response.data; // Return filter options.
  },

  /**
   * Fetch real-time search suggestions.
   * @param query - The partial text input.
   * @param language - User's preferred language.
   */
  async getSuggestions(query: string, language: string) {
    const response = await axios.get(`${BASE_URL}/suggestions`, {
      params: { query, language },
    });
    return response.data; // Return suggestions.
  },

  /**
   * Log search interactions for analytics.
   */
  async logSearchMetrics(searchData: { query: string; filters?: any; userId?: string }) {
    await axios.post(`${BASE_URL}/metrics`, searchData);
    },
  
    /**
   * Perform a text-based search with optional filters.
   * @param query - The text query.
   * @param filters - Optional filters for refining results.
   */
    async searchByText(query: string, filters = {}) {
        const response = await axios.get(`${BASE_URL}/text`, {
          params: { query, ...filters },
        });
        return response.data; // Return search results.
      },
    
      /**
       * Perform an image-based search.
       * @param imageData - The image data (base64 or file blob).
       */
      async searchByImage(imageData: string) {
        const response = await axios.post(`${BASE_URL}/image`, { image: imageData });
        return response.data; // Return search results.
      },
    
      /**
       * Perform a voice-based search.
       * @param audioData - The audio file or base64 data.
       */
      async searchByVoice(audioData: string) {
        const response = await axios.post(`${BASE_URL}/voice`, { audio: audioData });
        return response.data; // Return search results.
    },
      
    executeCrossModalSearch: async (payload: { text: string; image: File | null }) => {
        const formData = new FormData();
        if (payload.text) formData.append("text", payload.text);
        if (payload.image) formData.append("image", payload.image);
      
        const response = await axios.post("/api/search/cross-modal", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      }, // Replace the semicolon with a comma
      
    executeSearch: async ({
        query,
        filters,
        category,
        userId,
      }: {
        query: string;
        filters?: any;
        category?: string;
        userId?: string;
      }) => {
        const response = await axios.post(`${BASE_URL}/personalized`, {
          query,
          filters,
          category,
          userId,
        });
        return response.data;
      },
    
      fetchSearchResults: async ({ query, page, filters }: { query: string; page: number; filters: any }) => {
        const response = await axios.get('/api/search/results', {
          params: { query, page, ...filters },
        });
        return response.data;
      },
};

export default searchService;
