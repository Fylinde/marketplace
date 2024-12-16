import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Divider from "../Divider";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import SaleNavbar from "../navbar/SaleNavbar";
import Sticky from "../sticky/Sticky";
import Topbar from "../topbar/Topbar";
import StyledAppLayout from "./AppLayoutStyle";

interface SaleLayout2Props {
  title?: string;
  metaDescription?: string;
  metaKeywords?: string;
  saleCategoryList?: { icon: string; title: string; segment: "B2C" | "B2B" | "C2C" }[];
  children: React.ReactNode;
  showTopbar?: boolean;
  showFooter?: boolean;
}

const SaleLayout2: React.FC<SaleLayout2Props> = ({
  children,
  title = "Multivendor Ecommerce | Sale",
  metaDescription = "Shop the best deals on various categories including fashion, electronics, and more.",
  metaKeywords = "ecommerce, sale, fashion, electronics, furniture, beauty products",
  saleCategoryList = [
    { icon: "t-shirt", title: "Men", segment: "B2C" },
    { icon: "women-dress", title: "Women", segment: "B2C" },
    { icon: "camera", title: "Electronics", segment: "B2B" },
    { icon: "sofa", title: "Furniture", segment: "B2C" },
    { icon: "basket-ball", title: "Sport", segment: "C2C" },
  ],
  showTopbar = true,
  showFooter = true,
}) => {
  const [currentSegment, setCurrentSegment] = useState<"B2C" | "B2B" | "C2C">("B2C");

  const handleSegmentChange = (segment: "B2C" | "B2B" | "C2C") => {
    setCurrentSegment(segment);
  };

  return (
    <StyledAppLayout>
      <Helmet>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
      </Helmet>

      {showTopbar && <Topbar />}

      <Header />
      <Divider />

      <Sticky fixedOn={0}>
        <SaleNavbar
          saleCategoryList={saleCategoryList}
          currentSegment={currentSegment}
          onSegmentChange={handleSegmentChange}
        />
      </Sticky>

      <div className="section-after-sticky">{children}</div>

      <MobileNavigationBar />

      {showFooter && <Footer />}
    </StyledAppLayout>
  );
};

export default SaleLayout2;
