import { rest } from "msw";
import { fetchMockAppleWatchAdvertisement } from "../data/advertisement";

export const advertisementHandlers = [
  // Mock GET handler for Apple Watch advertisement
  rest.get("/api/advertisements/apple-watch", async (req, res, ctx) => {
    try {
      const mockAd = await fetchMockAppleWatchAdvertisement();
      return res(
        ctx.status(200),
        ctx.json(mockAd) // Return the mock advertisement data
      );
    } catch (error) {
      console.warn("Error fetching advertisement in mock:", error);
      return res(
        ctx.status(500),
        ctx.json({ error: "Failed to fetch advertisement" })
      );
    }
  }),
];
