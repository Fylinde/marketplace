
import Box from "components/Box";
import CarouselCard1 from "components/carousel-cards/CarouselCard1";
import Carousel from "components/carousel/Carousel";
import Container from "components/Container";
import Navbar from "components/navbar/Navbar";
import React, { Fragment } from "react";

const Section1: React.FC = () => {
  return (
    <Fragment>
      <Navbar navListOpen={true} />
      <Box bg="gray.white" mb="3.75rem">
        <Container pb="2rem">
          <Carousel
            totalSlides={5}
            visibleSlides={1}
            infinite={true}
            autoPlay={true}
            showDots={true}
            showArrow={false}
            spacing="0px"
          >
            <CarouselCard1 />
            <CarouselCard1 />
            <CarouselCard1 />
            <CarouselCard1 />
            <CarouselCard1 />
          </Carousel>
        </Container>
      </Box>
    </Fragment>
  );
};

export default Section1;
