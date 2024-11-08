import Box from "components/Box";
import Carousel from "components/carousel/Carousel";
import CategorySectionCreator from "components/CategorySectionCreator";
import ProductCard1 from "components/product-cards/ProductCard1";
import productDatabase from "data/product-database";
import useWindowSize from "hooks/useWindowSize";
import React, { useEffect, useState } from "react";

export interface Section8Props {}

const Section8: React.FC<Section8Props> = () => {
  const [visibleSlides, setVisibleSlides] = useState(4);
  const { width } = useWindowSize(); // Destructure the width property from the hook's return value

  useEffect(() => {
    if (width !== undefined && width !== null) { // Add check for both undefined and null
      if (width < 500) setVisibleSlides(1);
      else if (width < 650) setVisibleSlides(2);
      else if (width < 950) setVisibleSlides(3);
      else setVisibleSlides(4);
    }
  }, [width]);

  return (
    <CategorySectionCreator title="Most Viewed">
      <Box my="-0.25rem">
        <Carousel
          totalSlides={10}
          visibleSlides={visibleSlides}
          arrowButtonColor="inherit"
        >
          {productDatabase.slice(281, 291).map((item) => (
            <Box py="0.25rem" key={item.id}>
              <ProductCard1 {...item} />
            </Box>
          ))}
        </Carousel>
      </Box>
    </CategorySectionCreator>
  );
};

export default Section8;
