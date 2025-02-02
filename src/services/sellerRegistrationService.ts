import axios from "axios";
import { AccountDetails, SellerVerification } from "../types/sharedTypes";

const API_URL = "http://localhost:5000/api/sellers";

const registerAccount = async (accountData: AccountDetails): Promise<any> => {
    const response = await axios.post(`${API_URL}/registerAccount`, accountData);
    return response.data;
};

const verifyEmail = async (verificationData: SellerVerification): Promise<any> => {
    const response = await axios.post(`${API_URL}/verifyEmail`, verificationData);
    return response.data;
};
const sendVerification = async (emailOrPhone: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/sendVerification`, { emailOrPhone });
    return response.data;
};

const verifyOTP = async (emailOrPhone: string, verificationCode: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/verifyOTP`, { emailOrPhone, verificationCode });
    return response.data;
};

const sellerRegistrationService = { registerAccount, verifyEmail };
export default sellerRegistrationService;
