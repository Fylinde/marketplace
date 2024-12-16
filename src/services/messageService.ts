import axios from "axios";

const messageService = {
  /**
   * Fetch messages for regular chat.
   * @returns A promise resolving to a list of chat messages.
   */
  fetchChatMessages: async (): Promise<any[]> => {
    const response = await axios.get("/api/chat/messages");
    return response.data;
  },

  /**
   * Fetch messages for chatbot.
   * @returns A promise resolving to a list of chatbot messages.
   */
  fetchChatbotMessages: async (): Promise<any[]> => {
    const response = await axios.get("/api/chatbot/messages");
    return response.data;
  },

  /**
   * Send a new message in regular chat.
   * @param conversationId The ID of the conversation.
   * @param content The message content.
   * @returns A promise resolving to the updated conversation.
   */
  sendChatMessage: async (conversationId: string, content: string): Promise<any> => {
    const response = await axios.post(`/api/chat/messages/${conversationId}`, { content });
    return response.data;
  },

  /**
   * Send a new message to the chatbot.
   * @param content The message content.
   * @returns A promise resolving to the chatbot's response.
   */
  sendChatbotMessage: async (content: string): Promise<any> => {
    const response = await axios.post("/api/chatbot/messages", { content });
    return response.data;
  },
};

export default messageService;
