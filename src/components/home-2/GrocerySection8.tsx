import Box from "components/Box";
import Carousel from "components/carousel/Carousel";
import ProductCard10 from "components/product-cards/ProductCard10";
import productDatabase from "data/product-database";
import useWindowSize from "hooks/useWindowSize";
import React, { useEffect, useState } from "react";
import { H3 } from "../Typography";

const GrocerySection8: React.FC = () => {
  const [visibleSlides, setVisibleSlides] = useState(3);
  const { width } = useWindowSize(); // Destructure width from the hook

  useEffect(() => {
    if (width !== undefined && width !== null) { // Check for both undefined and null
      if (width < 500) setVisibleSlides(1);
      else if (width < 950) setVisibleSlides(2);
      else setVisibleSlides(3);
    }
  }, [width]);

  return (
    <Box>
      <H3 fontSize="25px" mb="2rem">
        Snacks, Drinks, Dairy & More
      </H3>

      <Box my="-0.25rem">
        <Carousel
          totalSlides={9}
          visibleSlides={visibleSlides}
          step={3}
          showDots
          arrowButtonColor="inherit"
          showArrowOnHover={true}
        >
          {productDatabase.slice(197, 206).map((item, ind) => (
            <Box py="0.25rem" height="100%" key={ind}>
              <ProductCard10 {...item} off={25} />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default GrocerySection8;
