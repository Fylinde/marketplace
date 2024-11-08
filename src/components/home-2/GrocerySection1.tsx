import AppStore from "components/AppStore";
import Box from "components/Box";
import Card from "components/Card";
import Carousel from "components/carousel/Carousel";
import FlexBox from "components/FlexBox";
import LazyImage from "components/LazyImage";
import { H1, H5, H6 } from "components/Typography";
import React from "react";
import { GrocerySection1Wrapper } from "./GrocerySectionStyle";

const GrocerySection1: React.FC = () => {
  return (
    <GrocerySection1Wrapper>
      <Carousel
        totalSlides={3}
        visibleSlides={1}
        showDots={true}
        showArrow={false}
        autoPlay={true}
        dotClass="carousel-dot"
        dotColor="white"
        spacing="0px"
      >
        {[...new Array(3)].map((_item) => (
          <Card
            bg="primary.main"
            color="white"
            borderRadius={0}
            position="relative"
            key={Math.random()}
          >
            <FlexBox style={{ alignItems: "center", flexWrap: "wrap", display: "flex" }}>
              <Box className="card__inner-box" flex="1 1 0">
                <H1 maxWidth="280px" mb="0.5rem" lineHeight="1.27">
                  Get Your Grocery Within 40 Minutes
                </H1>
                <H6
                  maxWidth="470px"
                  color="inherit"
                  fontWeight="400"
                  mb="2.5rem"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu
                  sed pellentesque nibh tortor.
                </H6>

                <H5 fontSize="18px" fontWeight="700" mb="1.25rem">
                  Try our mobile app!
                </H5>

                <AppStore />
              </Box>
              <Box
                flex="1 1 0"
                minWidth="285px"
                height="180px"
                position="relative"
              >
                <LazyImage
                  src="/assets/images/products/cumin.png"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  alt="Cumin Product"
                />
              </Box>
            </FlexBox>
          </Card>
        ))}
      </Carousel>
    </GrocerySection1Wrapper>
  );
};

export default GrocerySection1;
