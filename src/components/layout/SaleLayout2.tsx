import Head from "next/head";
import React from "react";
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
  children: React.ReactNode; // Add 'children' prop to the type definition
}

const SaleLayout2: React.FC<SaleLayout2Props> = ({
  children,
  title = "Multivendor Ecommerce | Sale",
}) => {
  return (
    <StyledAppLayout>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Topbar />
      <Header />
      <Divider />
      <Sticky fixedOn={0}>
        <SaleNavbar saleCategoryList={saleCategoryList} />
      </Sticky>
      <div className="section-after-sticky">{children}</div>
      <MobileNavigationBar />
      <Footer />
    </StyledAppLayout>
  );
};

const saleCategoryList = [
  {
    icon: "t-shirt",
    title: "Men",
  },
  {
    icon: "women-dress",
    title: "Women",
  },
  {
    icon: "beauty-products",
    title: "Cosmetics",
  },
  {
    icon: "watch",
    title: "Accessories",
  },
  {
    icon: "camera",
    title: "Electronics",
  },
  {
    icon: "sofa",
    title: "Furniture",
  },
  {
    icon: "basket-ball",
    title: "Sport",
  },
  {
    icon: "wheel",
    title: "Automobile",
  },
  {
    icon: "drill-machine",
    title: "Hardware",
  },
  {
    icon: "baby-feeder",
    title: "Baby products",
  },
  {
    icon: "picture",
    title: "Photos",
  },
  {
    icon: "t-shirt",
    title: "Clothes",
  },
];

export default SaleLayout2;
