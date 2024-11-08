import Box from "components/Box";
import Button from "components/buttons/Button";
import Card from "components/Card";
import Carousel from "components/carousel/Carousel";
import FlexBox from "components/FlexBox";
import LazyImage from "components/LazyImage";
import { H3, H5 } from "components/Typography";
import { Link } from "react-router-dom";
import React from "react";
import { GrocerySection6Wrapper } from "./GrocerySectionStyle";

const GrocerySection6: React.FC = () => {
  return (
    <GrocerySection6Wrapper>
      <Box m="-0.25rem">
        <Carousel
          totalSlides={3}
          visibleSlides={1}
          showDots={true}
          autoPlay={true}
          spacing="0px"
          arrowButtonColor="inherit"
          showArrowOnHover={true}
        >
          {cardList.map((item, ind) => (
            <Box p="0.25rem" key={ind}>
              <Card className="carousel-card" bg={item.bgColor}>
                <FlexBox
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Box flex="1 1 0">
                    <H5 fontWeight="600" fontSize="18px" mb="0.5rem">
                      {item.subtitle}
                    </H5>
                    <H3 mb="2rem" fontSize="35px" lineHeight="1.37">
                      {item.title}
                    </H3>

                    {/* Use Link directly without the nested <a> */}
                    <Link to={item.shopUrl}>
                      <Button variant="contained" color="primary">
                        Shop Now
                      </Button>
                    </Link>
                  </Box>
                  <LazyImage
                    src={item.imgUrl}
                    width={320}
                    height={200}
                    style={{ objectFit: "contain" }}
                    alt={item.title}
                  />
                </FlexBox>
              </Card>
            </Box>
          ))}
        </Carousel>
      </Box>
    </GrocerySection6Wrapper>
  );
};

const cardList = [
  {
    title: "25% Special Off Today Only for Vegetables",
    subtitle: "Till 10 Sept, 2021",
    imgUrl:
      "/assets/images/products/kisspng-organic-food-leaf-vegetable-fruit-rich-vegetables-5aa9f4d026ae09 1.png",
    shopUrl: "/",
    bgColor: "#F6FFE5",
  },
  {
    title: "15% Off for All Product Only Need to Subscribe",
    subtitle: "Subscribe Us",
    imgUrl:
      "/assets/images/products/kisspng-organic-food-milk-food-gift-baskets-grocery-5abeaffc1e5b25 1.png",
    shopUrl: "/",
    bgColor: "#FFF8E5",
  },
  {
    title: "25% Special Off Today Only for Vegetables",
    subtitle: "Till 10 Sept, 2021",
    imgUrl:
      "/assets/images/products/kisspng-organic-food-leaf-vegetable-fruit-rich-vegetables-5aa9f4d026ae09 1.png",
    shopUrl: "/",
    bgColor: "#F6FFE5",
  },
];

export default GrocerySection6;
