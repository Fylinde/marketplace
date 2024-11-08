import React from "react";
import { Helmet } from "react-helmet-async"; 
import Footer from "../footer/Footer";
import Header from "../header/Header";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Navbar from "../navbar/Navbar";
import Topbar from "../topbar/Topbar";
import StyledAppLayout from "./AppLayoutStyle";

interface SaleLayout1Props {
  title?: string;
  children: React.ReactNode; // Explicitly define the 'children' prop
}

const SaleLayout1: React.FC<SaleLayout1Props> = ({
  children,
  title = "Multivendor Ecommerce | Sale",
}) => (
  <StyledAppLayout>
    <Helmet>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Helmet>
    <Topbar />
    <Header />
    <Navbar />
    {children}
    <MobileNavigationBar />
    <Footer />
  </StyledAppLayout>
);

export default SaleLayout1;
