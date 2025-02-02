import { rest } from "msw";
import { mockFeaturedBrands } from "../data/mockFeaturedBrands";

export const featuredBrandsHandlers = [
    rest.get("/api/brands", (req, res, ctx) => {
        const featured = req.url.searchParams.get("featured");
        if (featured === "true") {
            return res(ctx.json({ brands: mockFeaturedBrands }));
        }
        return res(ctx.status(400), ctx.json({ error: "Invalid request" }));
    }),
];
