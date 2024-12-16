import axios from "../redux/slices/utils/axiosSetup";

export interface Certification {
  id: string;
  name: string;
  description: string;
  issueDate: string;
  expiryDate?: string;
  issuer: string;
}

const BASE_URL = "/api/certifications";

const certificationService = {
  /**
   * Fetch all certifications
   */
  getCertifications: async (): Promise<Certification[]> => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  /**
   * Add a new certification
   */
  addCertification: async (certification: Certification): Promise<Certification> => {
    const response = await axios.post(BASE_URL, certification);
    return response.data;
  },

  /**
   * Update an existing certification
   */
  updateCertification: async (certification: Certification): Promise<Certification> => {
    const response = await axios.put(`${BASE_URL}/${certification.id}`, certification);
    return response.data;
  },

  /**
   * Delete a certification
   */
  deleteCertification: async (certificationId: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${certificationId}`);
  },
};

export default certificationService;
