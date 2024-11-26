import axios from "axios";

export interface PackagingGuideline {
  id: string;
  title: string;
  description: string;
  complianceLevel: "Mandatory" | "Recommended";
  region: string;
}

const packagingService = {
  /**
   * Fetch all packaging guidelines from the API.
   * @returns A promise resolving to an array of guidelines.
   */
  fetchPackagingGuidelines: async (): Promise<PackagingGuideline[]> => {
    const response = await axios.get("/api/packaging-guidelines");
    return response.data;
  },

  /**
   * Create a new packaging guideline.
   * @param guideline The guideline to create.
   * @returns A promise resolving to the created guideline.
   */
  createGuideline: async (guideline: Partial<PackagingGuideline>): Promise<PackagingGuideline> => {
    const response = await axios.post("/api/packaging-guidelines", guideline);
    return response.data;
  },

  /**
   * Update an existing packaging guideline.
   * @param id The ID of the guideline to update.
   * @param updates The updated properties.
   * @returns A promise resolving to the updated guideline.
   */
  updateGuideline: async (id: string, updates: Partial<PackagingGuideline>): Promise<PackagingGuideline> => {
    const response = await axios.put(`/api/packaging-guidelines/${id}`, updates);
    return response.data;
  },

  /**
   * Delete a packaging guideline by ID.
   * @param id The ID of the guideline to delete.
   * @returns A promise resolving to a success message or status.
   */
  deleteGuideline: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/api/packaging-guidelines/${id}`);
    return response.data;
  },
};

export default packagingService;
