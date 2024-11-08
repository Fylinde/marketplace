import React, { useEffect, useState } from "react";
import Box from "components/Box";
import GroceryFooter from "components/home-2/GroceryFooter";
import GrocerySection1 from "components/home-2/GrocerySection1";
import GrocerySection2 from "components/home-2/GrocerySection2";
import GrocerySection3 from "components/home-2/GrocerySection3";
import GrocerySection4 from "components/home-2/GrocerySection4";
import GrocerySection5 from "components/home-2/GrocerySection5";
import GrocerySection6 from "components/home-2/GrocerySection6";
import GrocerySection7 from "components/home-2/GrocerySection7";
import GrocerySection8 from "components/home-2/GrocerySection8";
import GrocerySection9 from "components/home-2/GrocerySection9";
import GrocerySidenav from "components/home-2/GrocerySidenav";
import GroceryWrapper from "components/home-2/GroceryWrapper";
import GroceryLayout from "components/layout/GroceryLayout";
import { debounce } from "lodash";

const Home2: React.FC = () => {
  const [isSidenavFixed, setSidenavFixed] = useState(false);

  useEffect(() => {
    const scrollListener = debounce(() => {
      setSidenavFixed(window.pageYOffset > 60);
    }, 0);

    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  return (
    <GroceryLayout>
      <GroceryWrapper isSidenavFixed={isSidenavFixed}>
        <Box className="sidenav">
          <GrocerySidenav isFixed={isSidenavFixed} />
        </Box>
        <Box className="content">
          <Box className="section-1">
            <GrocerySection1 />
          </Box>
          <Box mb="3rem" overflow="hidden">
            <GrocerySection2 />
          </Box>
          <Box mb="3rem">
            <GrocerySection3 />
          </Box>
          <Box mb="3rem">
            <GrocerySection4 />
          </Box>
          <Box mb="3rem">
            <GrocerySection5 />
          </Box>
          <Box mb="3rem">
            <GrocerySection6 />
          </Box>
          <Box mb="3rem">
            <GrocerySection7 />
          </Box>
          <Box mb="3rem">
            <GrocerySection8 />
          </Box>
          <Box mb="3rem">
            <GrocerySection9 />
          </Box>

          <GroceryFooter />
        </Box>
      </GroceryWrapper>
    </GroceryLayout>
  );
};

export default Home2;
