import axios from "../redux/slices/utils/axiosSetup";

const chatbotService = {
  /**
    * Send a user message to the chatbot and get a response.
    * @param message The user's message.
    * @param context Optional context data for the conversation.
    * @returns A promise resolving to the chatbot's response.
    */
  sendMessage: async (message: string, context?: object): Promise<string> => {
    const response = await axios.post("/api/chatbot/message", { message, context });
    return response.data.response;
  },

  /**
   * Fetch the chatbot's conversation history with a specific user or session.
   * @param sessionId The unique session ID for the conversation.
   * @returns A promise resolving to the conversation history.
   */
  getConversationHistory: async (sessionId: string): Promise<{ sender: string; message: string; timestamp: string }[]> => {
    const response = await axios.get(`/api/chatbot/conversations/${sessionId}`);
    return response.data;
  },

  /**
   * Get AI-suggested solutions for a specific ticket.
   * @param ticketId The ID of the ticket.
   * @returns A promise resolving to a list of AI solutions.
   */
  getAISolutions: async (ticketId: string): Promise<string[]> => {
    const response = await axios.get(`/api/chatbot/tickets/${ticketId}/solutions`);
    return response.data.solutions;
  },

  /**
   * Automatically respond to a user query using AI.
   * @param message The customer's query.
   * @returns A promise resolving to the AI-generated response.
   */
  getAIResponse: async (message: string): Promise<string> => {
    const response = await axios.post("/api/chatbot/ai-response", { message });
    return response.data.response;
  },

  /**
   * Escalate a chatbot conversation to human support.
   * @param sessionId The unique session ID for the conversation.
   * @returns A promise resolving to the escalation status.
   */
  escalateToHuman: async (sessionId: string): Promise<string> => {
    const response = await axios.post(`/api/chatbot/conversations/${sessionId}/escalate`);
    return response.data.status;
  },

  /**
   * Get AI-suggested responses for a specific context.
   * @param context The context for generating suggestions.
   * @returns A promise resolving to a list of suggested responses.
   */
  getSuggestedResponses: async (context: object): Promise<string[]> => {
    const response = await axios.post("/api/chatbot/suggestions", context);
    return response.data.suggestions; // Assuming the response is in { suggestions: [...] }
  },

  /**
   * Escalate a conversation to human support.
   * @param sessionId The unique session ID for the conversation.
   * @returns A promise resolving to the escalation status.
   */
  escalateToHumanSupport: async (sessionId: string): Promise<string> => {
    const response = await axios.post(`/api/chatbot/escalate/${sessionId}`);
    return response.data.status; // Assuming the response is in { status: "..." }
  },

  /**
   * Analyze chatbot performance for advanced analytics.
   * @returns A promise resolving to performance metrics.
   */
  getChatbotPerformance: async (): Promise<{
    totalConversations: number;
    resolvedByChatbot: number;
    escalatedToHuman: number;
    avgResponseTime: number;
  }> => {
    const response = await axios.get("/api/chatbot/performance");
    return response.data;
  },
};

export default chatbotService;
