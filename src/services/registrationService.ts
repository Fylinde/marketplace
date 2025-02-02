// src/services/registrationService.ts
import axios from "axios";

const AUTH_SERVICE_URL = 'http://localhost:8000';

const VENDOR_SERVICE_URL = "http://localhost:8012"; // Replace with environment variable if needed

interface RegisterSellerParams {
  full_name: string;
  email: string;
  password: string;
  seller_type: string;
}

/**
 * Registers a new seller by making an API call to the vendor-service.
 * 
 * @param {Object} params - Seller registration details.
 * @param {string} params.full_name - Seller's full name.
 * @param {string} params.email - Seller's email.
 * @param {string} params.password - Seller's password.
 * @param {string} params.seller_type - Type of seller ("professional" or "individual").
 * 
 * @returns {Promise<Object>} API response data.
 */
export const registerSeller = async ({ full_name, email, password, seller_type }: RegisterSellerParams) => {
  try {
      console.log("Initiating seller registration process...");

      // Make API call to start seller registration
      const response = await axios.post(`${VENDOR_SERVICE_URL}/sellers/register_seller`, {
          full_name,
          email,
          password,
          seller_type
      });

      console.log("Seller verification code sent. Awaiting user verification.");
      return response.data;
  } catch (error: unknown) {
      console.error("Error during seller registration process:", error);

      let errorMessage = "An unexpected error occurred.";
      
      if (axios.isAxiosError(error)) {
          if (error.response) {
              console.error("Server responded with:", error.response.data);
              errorMessage = error.response.data?.message || "Failed to register seller.";
          } else if (error.request) {
              console.error("No response received from the server.");
              errorMessage = "Unable to connect to the server. Please try again later.";
          } else {
              console.error("Request setup error:", error.message);
          }
      } else {
          console.error("Unknown error:", error);
      }

      throw new Error(errorMessage);
  }
};



/**
 * Verify Seller Code
 * @param email - Seller's email
 * @param code - Verification code received
 * @returns {Promise<boolean>} - Returns true if verification is successful, otherwise false
 */
export const verifySellerCode = async (email: string, code: string): Promise<boolean> => {
  try {
    console.log("[Frontend] Sending verification request:", { code, email });
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/verify-code`, {
      email,
      code,
    });

    return response.data.success; // Ensure backend returns { success: true/false }
  } catch (error) {
    console.error("Error verifying seller code:", error);
    return false;
  }
};

