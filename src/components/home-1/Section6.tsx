import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "redux/store"; // Adjust based on your project structure
import LazyImage from "components/LazyImage";
import Box from "../Box";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Hidden from "../hidden/Hidden";
import ProductCard1 from "../product-cards/ProductCard1";
import StyledProductCategory from "./ProductCategoryStyle";
import { fetchBrands } from "../../redux/slices/products/brandSlice"; // Redux actions for fetching brands and products
import { fetchProductsByBrand } from "../../redux/slices/products/productSlice";
import { Brand } from "types/brand";
import { Product } from "types/Product";

const Section6: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    products,
    loadingProducts,
  } = useSelector((state: RootState) => state.products);
  const {
    brands,
    loadingBrands,
    selectedBrand,
  } = useSelector((state: RootState) => state.brands);
  const { currentRates } = useSelector((state: RootState) => state.exchangeRate); // Extract exchange rates

  // Fetch brands and products on mount and whenever the selectedBrand changes
  useEffect(() => {
    if (!brands.length) {
      dispatch(fetchBrands());
    }
    dispatch(fetchProductsByBrand(selectedBrand || "")); // Fallback to an empty string if selectedBrand is null or undefined
  }, [dispatch, selectedBrand, brands.length]);

  // Handle brand/category selection
  const handleCategoryClick = (brand: Brand) => {
    dispatch(fetchProductsByBrand(brand.id === selectedBrand ? "" : brand.id));
  };

  return (
    <Container mb="80px">
      <FlexBox>
        {/* Sidebar for brands */}
        <Hidden down={768} mr="1.75rem">
          <Box shadow={6} borderRadius={10} padding="1.25rem" bg="white">
            {loadingBrands ? (
              <p>Loading Brands...</p>
            ) : (
              brands.map((brand: Brand, ind: number) => (
                <StyledProductCategory
                  key={brand.id}
                  id={brand.id.toString()}
                  mb="0.75rem"
                  bg={selectedBrand === brand.id ? "white" : "gray.100"}
                  shadow={selectedBrand === brand.id ? 4 : undefined}
                  onClick={() => handleCategoryClick(brand)}
                >
                  <LazyImage
                    width={20}
                    height={20}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={brand.imgUrl || "/assets/images/default-brand.png"}
                    alt={brand.name}
                  />
                  <span className="product-category-title">{brand.name}</span>
                </StyledProductCategory>
              ))
            )}
            <StyledProductCategory
              id="all"
              mt="4rem"
              bg={selectedBrand === "" ? "white" : "gray.100"}
              shadow={selectedBrand === "" ? 4 : undefined}
              onClick={() => handleCategoryClick({ id: "", name: "All Brands", imgUrl: "" } as Brand)}
            >
              <span id="all" className="product-category-title show-all">
                View All Brands
              </span>
            </StyledProductCategory>
          </Box>
        </Hidden>

        {/* Product Grid */}
        <Box flex="1 1 0" minWidth="0px">
          <CategorySectionHeader title="Cars" seeMoreLink="#" />
          {loadingProducts ? (
            <p>Loading Products...</p>
          ) : (
          <Grid container spacing={6}>
            {products.slice(0, 6).map((item: Product) => (
              <Grid item lg={4} sm={6} xs={12} key={item.id}>
                <ProductCard1
                  hoverEffect
                  id={item.id}
                  imgUrl={item.imgUrl || "/assets/images/default-product.png"}
                  title={item.title || "Untitled"}
                  sellerPrice={item.sellerPrice}
                  buyerPrice={item.buyerPrice}
                  sellerCurrency={item.sellerCurrency}
                  buyerCurrency={item.buyerCurrency}
                  exchangeRates={currentRates} // Pass currentRates instead of exchangeRates
                  rating={typeof item.rating === "number" ? item.rating : undefined}
                  productUrl={`/product/${item.id}`}
                />
              </Grid>
            ))}
          </Grid>

          )}
        </Box>
      </FlexBox>
    </Container>
  );
};

export default Section6;
