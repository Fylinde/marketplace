import Carousel from "components/carousel/Carousel";
import ProductCard11 from "components/product-cards/ProductCard11";
import productDatabase from "data/product-database";
import useWindowSize from "hooks/useWindowSize";
import React, { useEffect, useState } from "react";
import Box from "../Box";
import { H2 } from "../Typography";

export interface Section2Props {}

const Section2: React.FC<Section2Props> = () => {
  const [visibleSlides, setVisibleSlides] = useState(4);
  const { width } = useWindowSize(); // Destructure width from the hook

  useEffect(() => {
    if (width !== undefined && width !== null) { // Check for both undefined and null
      if (width < 500) setVisibleSlides(1);
      else if (width < 650) setVisibleSlides(2);
      else if (width < 950) setVisibleSlides(3);
      else setVisibleSlides(4);
    }
  }, [width]);

  return (
    <Box mb="3rem">
      <H2 mb="1.5rem">Top Picks</H2>
      <Box>
        <Carousel
          totalSlides={10}
          visibleSlides={visibleSlides}
          arrowButtonColor="inherit"
        >
          {productDatabase.slice(99, 108).map((item, ind) => (
            <ProductCard11 key={ind} {...item} />
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default Section2;
