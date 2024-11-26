import axios from "axios";

const BASE_URL = "/api/brands";

export const getBrands = async (page: number = 1) => {
  return await axios.get(BASE_URL, { params: { page } });
};

export const getBrandDetails = async (brandId: string) => {
  return await axios.get(`${BASE_URL}/${brandId}`);
};

export const createBrand = async (brandData: any) => {
  return await axios.post(BASE_URL, brandData);
};

export const updateBrand = async (brandId: string, brandData: any) => {
  return await axios.put(`${BASE_URL}/${brandId}`, brandData);
};

export const deleteBrand = async (brandId: string) => {
  return await axios.delete(`${BASE_URL}/${brandId}`);
};
