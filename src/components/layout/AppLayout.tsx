import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MobileNavigationBar from "../../components/mobile-navigation/MobileNavigationBar";
import Sticky from "../../components/sticky/Sticky";
// import Topbar from "../../components/topbar/Topbar";
import { Helmet } from "react-helmet-async";
import React from "react";
import StyledAppLayout from "./AppLayoutStyle";

type Props = {
  title?: string;
  navbar?: React.ReactNode; // Updated to ReactNode
  children: React.ReactNode; // Made required and updated type
};

const AppLayout: React.FC<Props> = ({
  children,
  navbar,
  title = "React Ecommerce Template",
}): JSX.Element => (
  <StyledAppLayout>
    {/* Use Helmet to replace Next.js Head */}
    <Helmet>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Helmet>

  {/*   <Topbar /> */}

    <Sticky fixedOn={0}>
      <Header />
    </Sticky>
   <main>
    {navbar && <div className="section-after-sticky">{navbar}</div>}
    {!navbar ? (
      <div className="section-after-sticky">{children}</div>
    ) : (
      children
    )}
   </main>
    <MobileNavigationBar />
    <Footer />
  </StyledAppLayout>
);

export default AppLayout;
