import axios from "axios";

const BASE_API_URL = "https://api.example.com/fraud";

export interface FraudReport {
  id: string;
  orderId: string;
  reason: string;
  status: "pending" | "resolved";
  createdAt: string;
  updatedAt: string;
  riskLevel: string;
  amount: number;
  currency: string;
  patterns: string[];
  
}

export interface FraudInsight {
    pattern: string;
    count: number;
  }

export const fraudService = {
     /**
   * Fetch all fraudulent orders
   */
  async fetchFraudulentOrders(): Promise<FraudReport[]> {
    const response = await axios.get<FraudReport[]>(`${BASE_API_URL}/reports`);
    return response.data;
  },

  /**
   * Fetch fraud insights
   */
  async fetchFraudInsights(): Promise<FraudInsight[]> {
    const response = await axios.get<FraudInsight[]>(`${BASE_API_URL}/insights`);
    return response.data;
  },

  /**
   * Mark an order as fraudulent
   * @param orderId - ID of the order to mark as fraudulent
   */
  async markOrderAsFraudulent(orderId: string): Promise<FraudReport> {
    const response = await axios.post<FraudReport>(`${BASE_API_URL}/mark-as-fraudulent`, { orderId });
    return response.data;
  },

  /**
   * Resolve a fraudulent order
   * @param orderId - ID of the fraudulent order to resolve
   */
  async resolveFraudulentOrder(orderId: string): Promise<FraudReport> {
    const response = await axios.patch<FraudReport>(`${BASE_API_URL}/resolve`, { orderId });
    return response.data;
  },
  // Fetch all fraud reports
  async getAllFraudReports(): Promise<FraudReport[]> {
    const response = await axios.get<FraudReport[]>(`${BASE_API_URL}/reports`);
    return response.data;
  },

  // Submit a new fraud report
  async submitFraudReport(orderId: string, reason: string): Promise<FraudReport> {
    const response = await axios.post<FraudReport>(`${BASE_API_URL}/reports`, { orderId, reason });
    return response.data;
  },

  // Update the status of a fraud report
  async updateFraudReportStatus(reportId: string, status: string): Promise<FraudReport> {
    const response = await axios.patch<FraudReport>(`${BASE_API_URL}/reports/${reportId}`, { status });
    return response.data;
  },
};
