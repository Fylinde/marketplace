import axios from "axios";

// src/services/featureService.ts
const featureService = {
  
    async fetchFeatures(): Promise<any[]> {
      // Original logic that fetches "features" for the app
      const response = await axios.get("/api/features");
      return response.data;
    },
    async fetchFeatureById(id: string): Promise<any> {
      const response = await axios.get(`/api/features/${id}`);
      return response.data;
    },
  };
  
  export default featureService;
  