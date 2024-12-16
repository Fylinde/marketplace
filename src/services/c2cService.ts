import axios from "axios";

const BASE_URL = "/api/c2c";

interface C2CListing {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

const getC2CListings = async (sellerId: string): Promise<C2CListing[]> => {
  const response = await axios.get<C2CListing[]>(`${BASE_URL}/listings`, { params: { sellerId } });
  return response.data;
};

const updateC2CListing = async ({
  listingId,
  updates,
}: {
  listingId: string;
  updates: Partial<C2CListing>;
}): Promise<C2CListing> => {
  const response = await axios.put<C2CListing>(`${BASE_URL}/listings/${listingId}`, updates);
  return response.data;
};

const c2cService = {
  getC2CListings,
  updateC2CListing,
};

export default c2cService;
