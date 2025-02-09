import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Card from "components/Card";
import Box from "../Box";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import ProductCard4 from "../product-cards/ProductCard4";
import ProductCard5 from "../product-cards/ProductCard5";
import { fetchTopRatedProducts } from "../../redux/slices/products/productSlice";
import { fetchFeaturedBrands } from "../../redux/slices/products/brandSlice";
import type { AppDispatch, RootState } from "../../redux/store";

const Section4: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    topRatedProducts = [],
    loading: topRatedLoading,
    error: topRatedError,
  } = useSelector((state: RootState) => state.products);

  const {
    featuredBrands = [],
    loading: featuredLoading,
    error: featuredError,
  } = useSelector((state: RootState) => state.brands);

  useEffect(() => {
    if (!topRatedProducts.length) {
      dispatch(fetchTopRatedProducts());
    }
    if (!featuredBrands.length) {
      dispatch(fetchFeaturedBrands());
    }
  }, [dispatch, topRatedProducts.length, featuredBrands.length]);

  return (
    <Box mb="3.75rem">
      <Container>
        <Box>
          <Grid container spacing={6}>
            {/* Top Rated Products Section */}
            <Grid item lg={6} xs={12}>
              <CategorySectionHeader
                iconName="ranking-1"
                title="Top Ratings"
                seeMoreLink="#"
              />
              <Card p="1rem">
                {topRatedLoading ? (
                  <p>Loading Top Rated Products...</p>
                ) : topRatedError ? (
                  <p>Error loading top-rated products: {topRatedError}</p>
                ) : (
                  <Grid container spacing={4}>
                    {topRatedProducts.map((item) => (
                      <Grid item md={3} sm={6} xs={6} key={item.id}>
                        <Link to={`/product/${item.id}`}>
                        <ProductCard4
                            imgUrl={item.imgUrl || "/assets/images/default-product.png"}
                            title={item.title || "Untitled"}
                            rating={typeof item.rating === "number" ? item.rating : item.rating?.average || 0} // Handle complex rating structure
                            price={item.price || 0}
                            reviewCount={item.reviewCount || 0}
                          />

                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Card>
            </Grid>

            {/* Featured Brands Section */}
            <Grid item md={6} xs={12}>
              <CategorySectionHeader
                iconName="Group"
                title="Featured Brands"
                seeMoreLink="#"
              />
              <Card p="1rem">
                {featuredLoading ? (
                  <p>Loading Featured Brands...</p>
                ) : featuredError ? (
                  <p>Error loading featured brands: {featuredError}</p>
                ) : (
                  <Grid container spacing={4}>
                    {featuredBrands.map((item) => (
                      <Grid item sm={6} xs={12} key={item.id}>
                        <Link to={`/brand/${item.id}`}>
                          <ProductCard5
                            title={item.title || "Untitled"}
                            imgUrl={item.imgUrl || "/assets/images/default-brand.png"}
                          />
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Section4;
