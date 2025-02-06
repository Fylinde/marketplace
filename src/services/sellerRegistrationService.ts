import axios from "axios";
import { AccountDetails, SellerVerification } from "../types/sharedTypes";

const API_URL = "http://localhost:5000/api/sellers";
const AUTH_SERVICE_URL = 'http://localhost:8000';

const VENDOR_SERVICE_URL = "http://localhost:8012"; // Replace with environment variable if needed





const registerAccount = async (accountData: AccountDetails): Promise<any> => {
    try {
        console.log("📢 Sending Registration Request:", JSON.stringify(accountData, null, 2));  // ✅ Log request payload
        const response = await axios.post(`${VENDOR_SERVICE_URL}/sellers/register_seller`, accountData);
        console.log("✅ API Response:", response.data);  // ✅ Log success response
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("❌ API Error Response:", error.response.data);  // ✅ Log API error response
        } else {
            console.error("❌ Request Failed:", error.message);  // ✅ Log request failure
        }
        throw error;
    }
};




const verifyEmail = async (verificationData: SellerVerification): Promise<any> => {
    const response = await axios.post(`${API_URL}/verifyEmail`, verificationData);
    return response.data;
};


// ✅ Fetch seller's current step
export const getSellerCurrentStep = async (sellerId: string): Promise<number> => {
    try {
        console.log(`📡 Fetching current step for seller ${sellerId}...`);
        const response = await axios.get(`${VENDOR_SERVICE_URL}/sellers/${sellerId}/current-step`);
        console.log(`✅ Current step received: ${response.data.current_step}`);
        return response.data.current_step;
    } catch (error) {
        console.warn("⚠️ Seller not found, resetting step to 1");
        return 1; // ✅ Default to step 1 if seller is missing
    }
};

const sendVerification = async (emailOrPhone: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/sendVerification`, { emailOrPhone });
    return response.data;
};

const verifyOTP = async (emailOrPhone: string, verificationCode: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/verifyOTP`, { emailOrPhone, verificationCode });
    return response.data;
};

const resendVerification = async (emailOrPhone: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/sendVerification`, { emailOrPhone });
    return response.data;
};

const sellerRegistrationService = {
    registerAccount,
    verifyEmail,
    sendVerification,
    verifyOTP,
    resendVerification,
};
export default sellerRegistrationService;
