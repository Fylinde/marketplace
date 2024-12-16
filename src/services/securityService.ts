import axios from "axios";

const API_BASE_URL = "https://api.yourapplication.com/security"; // Replace with your API base URL

interface AlertDetails {
  type: string;
  message: string;
}

const securityService = {
  async fetchTwoFactorStatus(userId: string): Promise<{ enabled: boolean }> {
    const response = await axios.get(`${API_BASE_URL}/twoFactor/status/${userId}`);
    return response.data;
  },

  async enableTwoFactor(userId: string): Promise<{ success: boolean }> {
    const response = await axios.post(`${API_BASE_URL}/twoFactor/enable`, { userId });
    return response.data;
  },

  async verifyTwoFactor(userId: string, token: string): Promise<{ verified: boolean }> {
    const response = await axios.post(`${API_BASE_URL}/twoFactor/verify`, { userId, token });
    return { verified: response.data.success }; // Map `success` to `verified`
  },

  async fetchAccessControlList(): Promise<
    Array<{ userId: string; userName: string; role: string; status: boolean }>
  > {
    const response = await axios.get(`${API_BASE_URL}/accessControl/list`);
    return response.data;
  },

  async updateAccessStatus(userId: string, status: boolean): Promise<{ success: boolean }> {
    const response = await axios.put(`${API_BASE_URL}/accessControl/status`, { userId, status });
    return response.data;
  },

  async fetchFailedLoginAttempts(userId: string): Promise<
    Array<{ ipAddress: string; timestamp: string }>
  > {
    const response = await axios.get(`${API_BASE_URL}/loginAttempts/${userId}`);
    return response.data;
  },

  async blockIp(ipAddress: string): Promise<{ success: boolean }> {
    const response = await axios.post(`${API_BASE_URL}/blockIp`, { ipAddress });
    return response.data;
  },

  async whitelistIp(ipAddress: string): Promise<{ success: boolean }> {
    const response = await axios.post(`${API_BASE_URL}/whitelistIp`, { ipAddress });
    return response.data;
  },

  async sendSecurityAlerts(userId: string, alertDetails: AlertDetails): Promise<{ success: boolean }> {
    const response = await axios.post(`${API_BASE_URL}/alerts`, { userId, alertDetails });
    return response.data;
  },
};

export default securityService;
