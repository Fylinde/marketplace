import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry"; // Retry logic
import pThrottle from "p-throttle"; // Rate limiting
import { setupCache } from "axios-cache-adapter"; // Caching (optional)

// Environment-based API URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.example.com";

// Localization settings (default to English and USD)
const DEFAULT_LANGUAGE = "en-US";
const DEFAULT_CURRENCY = "USD";

// Cache configuration (optional, for improved performance)
const cache = setupCache({
  maxAge: 15 * 60 * 1000, // Cache responses for 15 minutes
});

// Create an Axios instance with default settings
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
  adapter: cache.adapter, // Optional: Enable caching
});

// === Rate Limiting ===
// Prevent API spamming by limiting requests to 5 per second
const throttle = pThrottle({
  limit: 5, // Max 5 requests
  interval: 1000, // Per second
});

// Wrap Axios request function with throttling (disabled for non-production)
if (process.env.NODE_ENV === "production") {
  api.request = throttle(api.request);
}

// === Retry Logic ===
// Automatically retry failed requests up to 3 times for specific errors
axiosRetry(api, {
  retries: process.env.NODE_ENV === "production" ? 3 : 0, // Disable retries in development
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
  retryCondition: (error) => {
    // Retry for network errors or rate-limiting errors (HTTP 429)
    return (
      axiosRetry.isNetworkError(error) ||
      error.response?.status === 429 // Too many requests
    );
  },
});

// === Request Interceptors ===
api.interceptors.request.use(
  (config) => {
    // Safely retrieve data from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const language = typeof window !== "undefined" ? localStorage.getItem("language") || DEFAULT_LANGUAGE : DEFAULT_LANGUAGE;
    const currency = typeof window !== "undefined" ? localStorage.getItem("currency") || DEFAULT_CURRENCY : DEFAULT_CURRENCY;

    // Attach Authorization token to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach Localization Headers
    config.headers["Accept-Language"] = language; // Set language for localization
    config.headers["X-Currency"] = currency; // Set currency for transactions

    // Log outgoing requests in development mode
    if (process.env.NODE_ENV === "development") {
      console.log(`[Request] ${config.method?.toUpperCase()} - ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// === Response Interceptors ===
api.interceptors.response.use(
  (response) => {
    // Log responses in development mode
    if (process.env.NODE_ENV === "development") {
      console.log(`[Response] ${response.config.method?.toUpperCase()} - ${response.config.url}`, response);
    }

    // Safeguard against missing `data` in responses
    return response.data || response; // Return raw response if `data` is missing
  },
  (error) => {
    console.error("[Response Error]", error.response || error.message);

    // Handle specific HTTP status codes
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          console.warn("Unauthorized access - redirecting to login...");
          // Safeguard against multiple redirects
          if (!error.response.config.__isRedirecting) {
            error.response.config.__isRedirecting = true;
            localStorage.removeItem("authToken");
            window.location.href = "/login"; // Uncomment for production
          }
          break;
        case 403: // Forbidden
          console.warn("Forbidden - you do not have permission.");
          break;
        case 404: // Not Found
          console.warn("API endpoint not found:", error.response.config.url);
          break;
        case 429: // Too Many Requests
          console.warn("Rate limit exceeded. Retrying...");
          break;
        case 500: // Server Error
          console.error("Server error - try again later.");
          break;
        default:
          console.warn("Unhandled HTTP error:", error.response.status);
      }
    }

    return Promise.reject(error);
  }
);

// === WebSocket or Server-Sent Events ===
// This function sets up a WebSocket connection for real-time updates
export const setupWebSocket = (url: string, onMessage: (data: any) => void) => {
  if (!url || !url.startsWith("ws")) {
    console.error("[WebSocket] Invalid URL:", url);
    return null;
  }

  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("[WebSocket] Connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data); // Handle incoming messages
    } catch (error) {
      console.error("[WebSocket] Failed to parse message:", event.data);
    }
  };

  socket.onerror = (error) => {
    console.error("[WebSocket] Error:", error);
  };

  socket.onclose = () => {
    console.warn("[WebSocket] Connection closed");
  };

  return socket;
};

export default api;
