import Box from "components/Box";
import Card from "components/Card";
import Carousel from "components/carousel/Carousel";
import FlexBox from "components/FlexBox";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H4 } from "components/Typography";
import productDatabase from "data/product-database";
import useWindowSize from "hooks/useWindowSize";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CategorySectionCreator from "../CategorySectionCreator";

const Section13: React.FC = () => {
  const [visibleSlides, setVisibleSlides] = useState(6);
  const { width } = useWindowSize();  // Extract width from useWindowSize()

  useEffect(() => {
    if (width && width < 370) setVisibleSlides(1);
    else if (width && width < 650) setVisibleSlides(2);
    else if (width && width < 950) setVisibleSlides(4);
    else setVisibleSlides(6);
  }, [width]);

  return (
    <CategorySectionCreator
      iconName="gift"
      title="Big Discounts"
      seeMoreLink="#"
    >
      <Box my="-0.25rem">
        <Carousel totalSlides={9} visibleSlides={visibleSlides}>
          {productDatabase.slice(60, 69).map((item, ind) => (
            <Box py="0.25rem" key={item.id}>
              <Card p="1rem">
                <Link to={`/product/${ind + 20}`}>
                  <HoverBox borderRadius={8} mb="0.5rem">
                    <LazyImage
                      src={item.imgUrl}
                      alt={item.title}
                      style={{ width: '100%', height: 'auto', objectFit: 'contain' }} // Use style prop for layout control
                    />
                  </HoverBox>
                  <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
                    {item.title}
                  </H4>

                  <FlexBox>
                    <H4
                      fontWeight="600"
                      fontSize="14px"
                      color="primary.main"
                      mr="0.5rem"
                    >
                      ${Math.ceil(item.price).toLocaleString()}
                    </H4>

                    <H4 fontWeight="600" fontSize="14px" color="text.muted">
                      <del>${Math.ceil(item.price).toLocaleString()}</del>
                    </H4>
                  </FlexBox>
                </Link>
              </Card>
            </Box>
          ))}
        </Carousel>
      </Box>
    </CategorySectionCreator>
  );
};

export default Section13;
