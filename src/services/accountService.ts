import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://api.yourdomain.com'; // Replace with your actual API base URL

// Utility function to set headers dynamically
const getHeaders = (token: string | null = null): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Account Service Object
const accountService = {
  // Login API
  login: async (credentials: { email: string; password: string }) => {
    return await axios.post(`${BASE_URL}/auth/login`, credentials, {
      headers: getHeaders(),
    });
  },

  // Register API
  register: async (registrationData: any) => {
    return await axios.post(`${BASE_URL}/auth/register`, registrationData, {
      headers: getHeaders(),
    });
  },

  // Fetch User Profile
  getProfile: async (token: string) => {
    return await axios.get(`${BASE_URL}/user/profile`, {
      headers: getHeaders(token),
    });
  },

  // Update User Profile
  updateProfile: async (profileData: any, token: string) => {
    return await axios.put(`${BASE_URL}/user/profile`, profileData, {
      headers: getHeaders(token),
    });
  },

  // Logout API
  logout: async (token: string) => {
    return await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: getHeaders(token),
      }
    );
  },

  // Fetch Activity Log
  getActivityLog: async (token: string) => {
    return await axios.get(`${BASE_URL}/user/activity-log`, {
      headers: getHeaders(token),
    });
  },

  // Update Preferences
  updatePreferences: async (preferences: any, token: string) => {
    return await axios.put(`${BASE_URL}/user/preferences`, preferences, {
      headers: getHeaders(token),
    });
  },

  // Change Password
  changePassword: async (passwordData: any, token: string) => {
    return await axios.post(`${BASE_URL}/user/change-password`, passwordData, {
      headers: getHeaders(token),
    });
  },

  // Fetch Notifications
  getNotifications: async (token: string) => {
    return await axios.get(`${BASE_URL}/user/notifications`, {
      headers: getHeaders(token),
    });
    },
  
    // Fetch account information
 fetchAccountInfo: async (token: string) => {
    return await axios.get(`${BASE_URL}/account/info`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    },

        // Update account information
 updateAccountInfo: async (data: any, token: string) => {
    return await axios.put(`${BASE_URL}/account/info`, data, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    },
};

export default accountService;
