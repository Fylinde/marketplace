import { ReactNode, ReactElement, FC } from "react";

// Define a custom type for pages that can have a layout
export type PageWithLayout<P = {}> = FC<P> & {
  /**
   * Optional `layout` property for specifying a static layout component.
   * Example usage:
   * ```
   * Page.layout = ({ children }) => <MainLayout>{children}</MainLayout>;
   * ```
   */
  layout?: (props: { children: ReactNode }) => JSX.Element;

  /**
   * Optional `getLayout` function for dynamic layouts.
   * Example usage:
   * ```
   * Page.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
   * ```
   */
  getLayout?: (page: ReactElement) => ReactNode;
};
