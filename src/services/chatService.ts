import axios from "axios";

// Define types for chat messages, file uploads, and archive responses
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface UploadResponse {
  fileUrl: string;
}

export interface ArchiveResponse {
  success: boolean;
  archivedAt: string;
}

// Define the base URL for all chat-related API endpoints
const BASE_URL = "/api/chats";

const chatService = {
    startChat: async (buyerId: string, sellerId: string) => {
      const response = await axios.post(BASE_URL, { buyerId, sellerId });
      return response.data; // Extract the data
    },
  
    postMessage: async (chatId: string, message: string) => {
      const response = await axios.post(`${BASE_URL}/${chatId}/messages`, { message });
      return response.data; // Extract the data
    },
  
    getMessages: async (chatId: string) => {
      const response = await axios.get(`${BASE_URL}/${chatId}/messages`);
      return response.data; // Extract the data
    },
  
    getChatParticipants: async (chatId: string) => {
      const response = await axios.get(`${BASE_URL}/${chatId}/participants`);
      return response.data; // Extract the data
    },
  
    markAsRead: async (chatId: string) => {
      const response = await axios.post(`${BASE_URL}/${chatId}/read`);
      return response.data; // Extract the data
    },
  
    uploadFile: async (chatId: string, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axios.post(`${BASE_URL}/${chatId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // Extract the data
    },
  
    archiveChat: async (chatId: string) => {
      const response = await axios.post(`${BASE_URL}/${chatId}/archive`);
      return response.data; // Extract the data
    },
    // Start a call
    startCall: async (participants: string[], options?: { chatId?: string }) => {
      const response = await fetch("/api/start-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants, ...options }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to start call");
      }
  
      return await response.json();
    },
    endCall: async (callId: string) => {
        const response = await axios.post(`/api/calls/end`, { callId });
        return response.data;
    },
      
    sendSignal: async (callId: string, signal: any) => {
        const response = await axios.post(`/api/calls/signal`, { callId, signal });
        return response.data;
    },
      
  };
  
  export default chatService;
  
