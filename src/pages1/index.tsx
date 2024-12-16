import React from "react";
import Section1 from "components/home-1/Section1";
import Section2 from "components/home-1/Section2";
import Section3 from "components/home-1/Section3";
import Section4 from "components/home-1/Section4";
import Section5 from "components/home-1/Section5";
import Section6 from "components/home-1/Section6";
import Section7 from "components/home-1/Section7";
import Section8 from "components/home-1/Section8";
import Section9 from "components/home-1/Section9";
import Section10 from "components/home-1/Section10";
import Section11 from "components/home-1/Section11";
import Section12 from "components/home-1/Section12";
import Section13 from "components/home-1/Section13";
import AppLayout from "components/layout/AppLayout"; // Ensure correct path
import { PageWithLayout } from "types/pageLayouts";

const IndexPage: PageWithLayout = () => {
  return (
    <main>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
      <Section11 />
      <Section12 />
      <Section13 />
    </main>
  );
};

// Explicitly assert that AppLayout satisfies the layout function type
IndexPage.layout = (props) => <AppLayout {...props} />;

export default IndexPage;
