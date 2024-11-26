import axios from "../redux/slices/axiosSetup";
import chatbotService from "./chatbotService";


export interface SupportTicket {
    id: string;
    subject: string;
    customerId: string;
    orderId?: string;
    description: string;
    status: "Open" | "In Progress" | "Resolved" | "Closed";
    createdAt: string;
    updatedAt?: string;
    messages: Array<{
      id: string;
      sender: "Customer" | "Support" | "Seller";
      message: string;
      timestamp: string;
    }>;
    aiSuggestions?: string[]; // Add AI suggestions property
  }
  

const supportService = {
  /**
   * Create a new support ticket.
   * @param ticketData Data for the new ticket.
   * @returns A promise resolving to the created ticket.
   */
  createSupportTicket: async (ticketData: Partial<SupportTicket>) => {
    const response = await axios.post("/api/support/tickets", ticketData);
    return response.data;
  },

  /**
   * Fetch all support tickets with optional filters.
   * @param filters Filters such as status, date range, or customerId.
   * @returns A promise resolving to the list of tickets.
   */
  getSupportTickets: async (filters?: { status?: string; customerId?: string }) => {
    const response = await axios.get("/api/support/tickets", { params: filters });
    return response.data;
  },

  /**
   * Fetch a specific support ticket by ID.
   * @param ticketId The ID of the ticket.
   * @returns A promise resolving to the ticket details.
   */
  getSupportTicketById: async (ticketId: string): Promise<SupportTicket> => {
    const response = await axios.get(`/api/support/tickets/${ticketId}`);
    return response.data;
  },

  /**
   * Update the status of a support ticket.
   * @param ticketId The ID of the ticket.
   * @param status The new status for the ticket.
   * @returns A promise resolving to the updated ticket.
   */
  updateTicketStatus: async (ticketId: string, status: "Open" | "In Progress" | "Resolved" | "Closed") => {
    const response = await axios.patch(`/api/support/tickets/${ticketId}/status`, { status });
    return response.data;
  },

  /**
   * Add a message to a support ticket.
   * @param ticketId The ID of the ticket.
   * @param message The message to add.
   * @returns A promise resolving to the updated ticket.
   */
  addTicketMessage: async (ticketId: string, message: { sender: string; message: string }) => {
    const response = await axios.post(`/api/support/tickets/${ticketId}/messages`, message);
    return response.data;
  },

  /**
   * Delete a support ticket.
   * @param ticketId The ID of the ticket to delete.
   * @returns A promise resolving to a success message.
   */
  deleteSupportTicket: async (ticketId: string) => {
    const response = await axios.delete(`/api/support/tickets/${ticketId}`);
    return response.data;
  },

  
   /**
   * Fetch AI-suggested solutions for a specific ticket.
   * @param ticketId The ID of the ticket.
   * @returns A promise resolving to a list of AI solutions.
   */
   getAISolutionsForTicket: async (ticketId: string) => {
    return chatbotService.getAISolutions(ticketId);
  },

  /**
   * Automatically respond to a query using AI.
   * @param message The customer's query.
   * @returns A promise resolving to the AI-generated response.
   */
  getAIResponseForQuery: async (message: string) => {
    return chatbotService.getAIResponse(message);
  },

  /**
   * Escalate an unresolved ticket to human support.
   * @param sessionId The unique session ID for the conversation.
   * @returns A promise resolving to the escalation status.
   */
  escalateUnresolvedTicket: async (sessionId: string) => {
    return chatbotService.escalateToHuman(sessionId);
    },
  
};

export default supportService;
