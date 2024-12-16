import axios from "../redux/slices/utils/axiosSetup";
import chatbotService from "./chatbotService";
import { KnowledgeBaseArticle } from "@/redux/slices/support/supportSlice";

const BASE_URL = "/api/support";


export interface SupportTicket {
  id: string;
  subject: string;
  customerId: string;
  orderId?: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  updatedAt?: string;
  title: string;
  messages: Array<{
    id: string;
    content: string;
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

  getKnowledgeBaseArticles: async () => {
    const response = await axios.get(`${BASE_URL}/knowledge-base`);
    return response.data; // Adjust this based on the actual API response
  },

  async submitAISuggestion(suggestion: string) {
    const response = await axios.post(`${BASE_URL}/ai-suggestions`, {
      suggestion,
    });
    return response.data;
  },

  async fetchSupportTickets(): Promise<SupportTicket[]> {
    const response = await axios.get("/api/support/tickets");
    return response.data.map((ticket: any) => ({
      id: ticket.id,
      title: ticket.title || "Untitled",
      status: ticket.status as "Open" | "In Progress" | "Resolved" | "Closed",
      subject: ticket.subject || "No subject provided",
      customerId: ticket.customerId || "Unknown",
      orderId: ticket.orderId || null,
      description: ticket.description || "",
      createdAt: ticket.createdAt || new Date().toISOString(),
      updatedAt: ticket.updatedAt || null,
      messages: ticket.messages?.map((message: any) => ({
        id: message.id,
        content: message.content || "",
        sender: message.sender || "Support",
        message: message.message || "",
        timestamp: message.timestamp || new Date().toISOString(),
      })) || [],
      aiSuggestions: ticket.aiSuggestions || [],
    }));
  },




  async fetchKnowledgeBaseArticles(): Promise<KnowledgeBaseArticle[]> {
    const response = await axios.get("/api/support/knowledge-base");
    return response.data.map((article: any) => ({
      id: article.id || "Unknown",
      title: article.title || "Untitled",
      content: article.content || "",
      tags: article.tags || [], // Ensure tags is an array
    }));
  },



};




export default supportService;
