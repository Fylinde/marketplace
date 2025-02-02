import { rest } from "msw";
import { mockTopRatedProducts } from "../data";

export const topRatedProductsHandlers = [
  rest.get("/api/products", (req, res, ctx) => {
    const topRated = req.url.searchParams.get("topRated");
    console.log('Received topRated products:', topRated);
    if (topRated === "true") {
      return res(ctx.json({ products: mockTopRatedProducts }));
    }
    return res(ctx.status(400), ctx.json({ error: "Invalid request" }));
  }),
];
