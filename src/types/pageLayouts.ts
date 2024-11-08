// src/types.d.ts
import { ReactNode, FC } from "react";

// Define a custom type for pages that can have a layout
export type PageWithLayout = FC & {
  layout?: FC<{ children: ReactNode }>;
};
