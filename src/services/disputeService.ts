import axios from "axios";
import { Dispute } from "../redux/slices/support/disputeSlice";

const BASE_API_URL = "/api/disputes";

const disputeService = {
  async getAllDisputes(): Promise<Dispute[]> {
    const response = await axios.get<Dispute[]>(`${BASE_API_URL}`);
    return response.data;
  },

  async resolveDispute(disputeId: string, resolutionNote: string): Promise<Dispute> {
    const response = await axios.patch<Dispute>(`${BASE_API_URL}/${disputeId}/resolve`, {
      resolutionNote,
    });
    return response.data;
  },


  async rejectDispute(disputeId: string): Promise<Dispute> {
    const response = await axios.patch<Dispute>(`${BASE_API_URL}/${disputeId}/reject`);
    return response.data;
  },
  async escalateDispute(disputeId: string): Promise<Dispute> {
    const response = await axios.patch<Dispute>(`${BASE_API_URL}/${disputeId}/reject`);
    return response.data;
  },

};

export default disputeService;
