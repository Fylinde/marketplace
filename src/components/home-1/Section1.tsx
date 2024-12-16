import React, { Fragment, useEffect } from "react";
import Box from "components/Box";
import CarouselCard1 from "components/carousel-cards/CarouselCard1";
import Carousel from "components/carousel/Carousel";
import Container from "components/Container";
import Navbar from "components/navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "../../redux/slices/products/productSlice"; // Adjusted path
import { RootState } from "../../redux/store";
import type { AppDispatch } from "../../redux/store";
import { Product } from "types/Product";

const Section1: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector((state: RootState) => state.products.products);
  const featuredProducts = products.filter(
    (product: Product) => product.tag === "featured"
  );

  const { loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchFeaturedProducts());
    }
  }, [dispatch, products.length]);

  return (
    <Fragment>
      <Navbar navListOpen={true} />
      <Box bg="gray.white" mb="3.75rem">
        <Container pb="2rem">
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p>Error loading products: {error}</p>
          ) : (
            <Carousel
              totalSlides={featuredProducts.length}
              visibleSlides={1}
              infinite={true}
              autoPlay={true}
              showDots={true}
              showArrow={true}
              spacing="0px"
            >
              {featuredProducts.map((item: Product, index: number) => (
                <CarouselCard1
                  key={index}
                  title={item.title || "Untitled"}
                  image={item.imgUrl || "/assets/images/default-product.png"}
                  link={`/product/${item.id}`}
                  description={item.description || ""}
                  subtitle={item.subtitle || "Best Product"}
                  buttonText="Shop Now"
                  buttonLink={`/product/${item.id}`}
                  imageUrl={item.secondaryImage || ""}
                />
              ))}
            </Carousel>
          )}
        </Container>
      </Box>
    </Fragment>
  );
};

export default Section1;
