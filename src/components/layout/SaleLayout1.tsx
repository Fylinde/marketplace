import React from "react";
import { Helmet } from "react-helmet-async"; 
import Footer from "../footer/Footer";
import Header from "../header/Header";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Navbar from "../navbar/Navbar";
// import Topbar from "../topbar/Topbar";
import StyledAppLayout from "./AppLayoutStyle";

interface SaleLayout1Props {
  title?: string;
  children: React.ReactNode;
  metaDescription?: string; // Dynamic meta description
  metaKeywords?: string[]; // Meta keywords for SEO
  showNavbar?: boolean; // Control visibility of Navbar
  showFooter?: boolean; // Control visibility of Footer
  showMobileNav?: boolean; // Control visibility of Mobile Navigation
  additionalStyles?: React.CSSProperties; // Custom styles for layout
}

const SaleLayout1: React.FC<SaleLayout1Props> = ({
  children,
  title = "Multiseller Ecommerce | Sale",
  metaDescription = "Discover amazing deals and discounts on our multiseller ecommerce platform.",
  metaKeywords = ["ecommerce", "sale", "multiseller", "shopping"],
  showNavbar = true,
  showFooter = true,
  showMobileNav = true,
  additionalStyles = {},
}) => (
  <StyledAppLayout style={additionalStyles}>
    <Helmet>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords.join(", ")} />
    </Helmet>

    {/* Topbar 
    <Topbar /> */}

    {/* Header */}
    <Header />

    {/* Conditional Navbar */}
    {showNavbar && <Navbar />}

    {/* Main Content */}
    <main>{children}</main>

    {/* Conditional Mobile Navigation */}
    {showMobileNav && <MobileNavigationBar />}

    {/* Conditional Footer */}
    {showFooter && <Footer />}
  </StyledAppLayout>
);

export default SaleLayout1;
