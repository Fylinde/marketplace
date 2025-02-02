import { rest } from "msw";
import { mockCategories } from "../data/categories";

export const categoriesHandlers = [
  rest.get("/api/categories", (req, res, ctx) => {
    return res(ctx.json({ categories: mockCategories }));
  }),
];
