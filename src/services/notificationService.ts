import axios from "axios";
// import { Notification } from "../redux/slices/notificationSlice";


export interface Notification {
    id: string;
    type: "order" | "dispute" | "promotion" | "system";
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}
  
const BASE_API_URL = "/api/notifications";

const notificationService = {
  async getAllNotifications(): Promise<Notification[]> {
    const response = await axios.get<Notification[]>(`${BASE_API_URL}`);
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await axios.patch<Notification>(`${BASE_API_URL}/${notificationId}/read`);
    return response.data;
    },
  
    /**
   * Clear all notifications.
   */
 clearAllNotifications: async (): Promise<void> => {
    await axios.delete(`${BASE_API_URL}`);
    },
};

export default notificationService;
