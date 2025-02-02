import React, { Fragment } from "react";

import Box from "../Box";
import Container from "../Container";
import Navbar from "../navbar/Navbar";
import Carousel from "../carousel/Carousel";
import CarouselCard1 from "../carousel-cards/CarouselCard1";

const Section1: React.FC = () => {
  const ads = [
    {
      title: "50% Off For Your First Shopping",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis consequat eu, quam etiam at quis ut convallis.",
      image: "/assets/images/products/apple-watch-0.png",
      buttonText: "Visit Collections",
      buttonLink: "#",
    },
    {
      title: "Discover New Trends",
      description:
        "Explore the latest fashion trends and refresh your wardrobe with unique styles.",
      image: "/assets/images/products/shoes-1.png",
      buttonText: "Shop Now",
      buttonLink: "#",
    },
    {
      title: "Gadget Sale",
      description:
        "Upgrade your gadgets with our exclusive offers on the latest technology.",
      image: "/assets/images/products/laptop-1.png",
      buttonText: "Explore Deals",
      buttonLink: "#",
    },
    {
      title: "Home Essentials",
      description:
        "Transform your living space with our curated selection of home essentials.",
      image: "/assets/images/products/furniture-1.png",
      buttonText: "Discover Now",
      buttonLink: "#",
    },
  ];

  return (
    <Fragment>
      <Navbar navListOpen={true} />
      <Box bg="gray.white" mb="3.75rem">
        <Container pb="2rem">
          <Carousel
            totalSlides={ads.length}
            visibleSlides={1}
            infinite={true}
            autoPlay={true}
            showDots={true}
            showArrow={false}
            spacing="0px"
          >
            {ads.map((ad, index) => (
              <CarouselCard1
                key={index}
                title={ad.title}
                description={ad.description}
                image={ad.image}
                buttonText={ad.buttonText}
                buttonLink={ad.buttonLink}
              />
            ))}
          </Carousel>
        </Container>
      </Box>
    </Fragment>
  );
};

export default Section1;
