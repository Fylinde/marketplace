import React, { Fragment } from "react";
import Box from "components/Box";
import Section1 from "components/home-3/Section1";
import Section6 from "components/home-3/Section6";
import Section7 from "components/home-3/Section7";
import Section8 from "components/home-3/Section8";
import Section9 from "components/home-3/Section9";
import Section10 from "components/home-3/Section10";
import Section11 from "components/home-3/Section11";
import Navbar from "components/navbar/Navbar";
import AppLayout from "components/layout/AppLayout";

const Home3: React.FC = () => {
  return (
    <AppLayout> {/* Wrapping content with AppLayout */}
      <Fragment>
        <Navbar />
        <Box my="2rem">
          <Section1 />
          <Section6 />
          <Section7 />
          <Section8 />
          <Section9 />
          <Section10 />
          <Section11 />
        </Box>
      </Fragment>
    </AppLayout>
  );
};

export default Home3;
