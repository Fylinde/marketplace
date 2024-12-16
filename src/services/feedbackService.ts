import axios from "axios";

const BASE_API_URL = "https://api.example.com/feedback";

export interface Feedback {
  id: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  response?: string; // Response from the seller
  createdAt: string;
  sentiment: 0 | 1 | 2;
}

/**
 * Fetch all feedback.
 */

export const fetchFeedback = async (): Promise<Feedback[]> => {
  const response = await axios.get("/api/feedback");
  return response.data.map((item: any) => ({
    id: item.id,
    orderId: item.orderId,
    customerName: item.customerName,
    rating: item.rating,
    comment: item.comment,
    response: item.response,
    createdAt: item.createdAt,
    sentiment: item.sentiment ?? 1, // Default to Neutral (1) if not provided
  }));
}

/**
 * Submit feedback for an order.
 */
async function submitFeedback(orderId: string, rating: number, comment: string): Promise<Feedback> {
  const response = await axios.post<Feedback>(`${BASE_API_URL}`, {
    orderId,
    rating,
    comment,
  });
  return response.data;
}

/**
 * Fetch feedback for a specific order.
 */
async function fetchFeedbackByOrderId(orderId: string): Promise<Feedback[]> {
  const response = await axios.get<Feedback[]>(`${BASE_API_URL}/order/${orderId}`);
  return response.data;
}

/**
 * Delete a specific feedback.
 */
async function deleteFeedback(feedbackId: string): Promise<void> {
  await axios.delete(`${BASE_API_URL}/${feedbackId}`);
}

/**
 * Respond to a specific feedback.
 */
async function respondToFeedback(feedbackId: string, response: string): Promise<Feedback> {
    const res = await axios.patch<Feedback>(`${BASE_API_URL}/${feedbackId}/response`, { response });
    return res.data;
  }

export default {
  respondToFeedback,
  fetchFeedback,
  submitFeedback,
  fetchFeedbackByOrderId,
  deleteFeedback,
};
