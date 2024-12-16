// services/billingService.ts
import axios from "axios";
import { BillingSummary } from "../redux/slices/orders/billingSlice";
import { BillingInformation } from "../types/sharedTypes";


const BASE_URL = "/api/billing";

const billingService = {
  getBillingDetails: async (): Promise<BillingInformation[]> => {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  },
  saveBillingDetail: async (billingDetail: BillingInformation): Promise<BillingInformation> => {
    const response = await axios.post(`${BASE_URL}`, billingDetail);
    return response.data;
  },
  modifyBillingDetail: async (id: string, billingDetail: BillingInformation): Promise<BillingInformation> => {
    const response = await axios.put(`${BASE_URL}/${id}`, billingDetail);
    return response.data;
  },
  deleteBillingDetail: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
  getBillingSummary: async (): Promise<BillingSummary> => {
    const response = await axios.get(`${BASE_URL}/summary`);
    return response.data;
  },
};

export default billingService;
