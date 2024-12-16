// src/services/UserPreferenceService.ts
import axios from "axios";

const BASE_URL = "/api/user-preferences";

const UserPreferenceService = {
  /**
   * Fetch user preferences.
   */
  getUserPreferences: async (userId: string) => {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
  },

  /**
   * Update user preferences.
   */
  updateUserPreferences: async (userId: string, preferences: Record<string, any>) => {
    const response = await axios.put(`${BASE_URL}/${userId}`, preferences);
    return response.data;
  },

  /**
   * Fetch user search history.
   */
  getUserSearchHistory: async (userId: string, limit = 10) => {
    const response = await axios.get(`${BASE_URL}/${userId}/history`, {
      params: { limit },
    });
    return response.data;
  },
};

export default UserPreferenceService;
