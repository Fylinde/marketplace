import axios from "axios";

const BASE_URL = "/api/auth";

const enableTwoFactor = async (userId: string) => {
  const response = await axios.post(`${BASE_URL}/enable-2fa`, { userId });
  return response.data;
};

const verifyTwoFactor = async (userId: string, token: string) => {
  const response = await axios.post(`${BASE_URL}/verify-2fa`, { userId, token });
  return response.data;
};

const authService = {
  enableTwoFactor,
  verifyTwoFactor,
  // Other auth-related functions
};

export default authService;
