import Box from "components/Box";
import Carousel from "components/carousel/Carousel";
import CategorySectionCreator from "components/CategorySectionCreator";
import ProductCard2 from "components/product-cards/ProductCard2";
import useWindowSize from "hooks/useWindowSize";
import React, { useEffect, useState } from "react";

const Section9: React.FC = () => {
  const [visibleSlides, setVisibleSlides] = useState(6);
  const { width } = useWindowSize(); // Assuming useWindowSize returns an object with width

  useEffect(() => {
    if (width !== undefined && width !== null) {  // Add undefined and null check for width
      if (width < 500) setVisibleSlides(1);
      else if (width < 650) setVisibleSlides(2);
      else if (width < 950) setVisibleSlides(3);
      else setVisibleSlides(4);
    }
  }, [width]);

  return (
    <CategorySectionCreator title="New Arrivals">
      <Carousel totalSlides={productList.length} visibleSlides={visibleSlides}>
        {productList.map((item, ind) => (
          <Box key={ind}>
            <ProductCard2 {...item} />
          </Box>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
};

const productList = [
  {
    title: "Sunglass",
    price: 150,
    imgUrl: "/assets/images/products/imagegoggles.png",
    productUrl: "/product/c1",
  },
  {
    title: "Makeup",
    price: 250,
    imgUrl: "/assets/images/products/lipstick (2).png",
    productUrl: "/product/c12",
  },
  {
    title: "Smart Watch",
    price: 350,
    imgUrl: "/assets/images/products/bgwatch.png",
    productUrl: "/product/c14",
  },
  {
    title: "Lipstick",
    price: 15,
    imgUrl: "/assets/images/products/lipstick (1).png",
    productUrl: "/product/c156",
  },
  {
    title: "Green plant",
    price: 55,
    imgUrl: "/assets/images/products/lipstick (4).png",
    productUrl: "/product/c145",
  },
  {
    title: "Bonsai tree",
    price: 535,
    imgUrl: "/assets/images/products/lipstick (3).png",
    productUrl: "/product/c176",
  },
  {
    title: "Sunglass",
    price: 150,
    imgUrl: "/assets/images/products/imagegoggles.png",
    productUrl: "/product/c1sg",
  },
  {
    title: "Makeup",
    price: 250,
    imgUrl: "/assets/images/products/lipstick (2).png",
    productUrl: "/product/c123",
  },
  {
    title: "Smart Watch",
    price: 350,
    imgUrl: "/assets/images/products/bgwatch.png",
    productUrl: "/product/c1r23",
  },
];

export default Section9;
