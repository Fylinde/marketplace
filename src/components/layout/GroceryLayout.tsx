import GroceryHeader from "components/header/GroceryHeader";
import MobileNavigationBar from "components/mobile-navigation/MobileNavigationBar";
import Navbar2 from "components/navbar/Navbar2";
import Sticky from "components/sticky/Sticky";
import { Helmet } from "react-helmet-async"; 
import React from "react";
import StyledAppLayout from "./AppLayoutStyle";

type Props = {
  title?: string;
  navbar?: React.ReactChild;
  children?: React.ReactNode;
};

const GroceryLayout: React.FC<Props> = ({
  children,
  title = "React Ecommerce Template",
}) => (
  <StyledAppLayout>
    {/* Use Helmet to replace Next.js Head */}
    <Helmet>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Helmet>

    <Sticky fixedOn={0}>
      <GroceryHeader />
    </Sticky>

    <div className="section-after-sticky">
      <Navbar2 />
    </div>

    {children}

    <MobileNavigationBar />
  </StyledAppLayout>
);

export default GroceryLayout;
