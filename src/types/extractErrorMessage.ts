import axios from "axios";


// Utility to extract error message from Axios or other error types


export const extractErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || "An unexpected error occurred";
    }
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  };