import Box from "components/Box";
import Carousel from "components/carousel/Carousel";
import ProductCard10 from "components/product-cards/ProductCard10";
import productDatabase from "data/product-database";
import useWindowSize from "hooks/useWindowSize";
import React, { useEffect, useState } from "react";
import { H3 } from "../Typography";

const GrocerySection5: React.FC = () => {
  const [visibleSlides, setVisibleSlides] = useState(3);
  const { width } = useWindowSize(); // Destructure width

  useEffect(() => {
    if (width !== undefined && width !== null) { // Check for both undefined and null
      if (width < 500) setVisibleSlides(1);
      else if (width < 650) setVisibleSlides(2);
      else if (width < 950) setVisibleSlides(2);
      else setVisibleSlides(3);
    }
  }, [width]);

  return (
    <Box>
      <H3 fontSize="25px" mb="2rem">
        Best Seller in Your Area
      </H3>

      <Box my="-0.25rem">
        <Carousel
          totalSlides={12}
          visibleSlides={visibleSlides}
          step={3}
          showDots
          arrowButtonColor="inherit"
          showArrowOnHover={true}
        >
          {productDatabase.slice(229, 241).map((item, ind) => (
            <Box py="0.25rem" key={ind}>
              <ProductCard10 {...item} rating={3} off={25} />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default GrocerySection5;
