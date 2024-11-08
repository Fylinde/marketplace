import Box from "components/Box";
import IconButton from "components/buttons/IconButton";
import Card from "components/Card";
import Carousel from "components/carousel/Carousel";
import FlexBox from "components/FlexBox";
import Grid from "components/grid/Grid";
import Icon from "components/icon/Icon";
import Image from "components/Image";
import { H2 } from "components/Typography";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Define the type for the products
interface Product {
  imgUrl: string;
  brand: string;
  off: number;
}

const SectionWrapper = styled.div`
  margin-bottom: 3.75rem;

  .left-arrow,
  .right-arrow {
    position: absolute;
    top: -34px;
    right: 0;
  }
  .left-arrow {
    right: 48px;
    left: auto;
  }
  .hinde-on-mobile {
    display: block;
  }
  @media only screen and (max-width: 425px) {
    .hinde-on-mobile {
      display: none;
    }
  }
`;

const Section5: React.FC = () => {
  const totalSlides = 3;
  const [currentSlide, setCurrentSlide] = useState(0);
  // Use Product[] as the type for productList
  const [productList, setProductList] = useState<Product[]>([]);

  const handleSlideChange = (count: number) => () => {
    if (count < 0) setCurrentSlide(0);
    else if (count > totalSlides - 1) setCurrentSlide(totalSlides - 1);
    else setCurrentSlide(count);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products/deals");
        setProductList(response.data); // Set productList with data from the API
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <SectionWrapper>
      <FlexBox style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mb="1.5rem">
        <H2 fontWeight="bold" lineHeight="1">
          Deal Of The Week
        </H2>

        <FlexBox style={{ display: "flex" }}>
          <IconButton
            variant="contained"
            color="primary"
            mr="0.5rem"
            disabled={currentSlide === 0}
            onClick={handleSlideChange(currentSlide - 1)}
          >
            <Icon variant="small" defaultcolor="currentColor">
              arrow-left
            </Icon>
          </IconButton>
          <IconButton
            variant="contained"
            color="primary"
            disabled={currentSlide === totalSlides - 1}
            onClick={handleSlideChange(currentSlide + 1)}
          >
            <Icon variant="small" defaultcolor="currentColor">
              arrow-right
            </Icon>
          </IconButton>
        </FlexBox>
      </FlexBox>

      <Box mt="-0.25rem" mb="-0.25rem">
        <Carousel
          totalSlides={3}
          visibleSlides={1}
          arrowButtonColor="primary"
          showDots={true}
          showArrow={false}
          currentSlide={currentSlide}
        >
          {[...new Array(totalSlides)].map((_item, ind) => (
            <Box py="0.25rem" key={ind}>
              <Grid container spacing={6}>
                {productList.map((item, ind) => (
                  <Grid item md={6} xs={12} key={ind}>
                    <Link to="/">
                      <Card position="relative">
                        <Image src={item.imgUrl} width="100%" />

                        <Box
                          position="absolute"
                          bg="gray.200"
                          fontWeight="600"
                          p="6px 12px"
                          top="1.25rem"
                          left="1.25rem"
                          borderRadius={5}
                        >
                          {item.brand}
                        </Box>
                        <Box
                          position="absolute"
                          bg="primary.main"
                          color="white"
                          fontWeight="600"
                          p="6px 12px"
                          top="1.25rem"
                          right="1.25rem"
                          borderRadius={5}
                        >
                          {item.off}% OFF
                        </Box>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Carousel>
      </Box>
    </SectionWrapper>
  );
};

export default Section5;
