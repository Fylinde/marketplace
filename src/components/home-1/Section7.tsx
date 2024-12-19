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
import Typography from "../Typography";
import StyledProductCategory from "./ProductCategoryStyle";
import { fetchShops } from "../../redux/slices/products/productSlice"; // Redux actions
import { fetchBrands } from "../../redux/slices/products/brandSlice";
import { fetchProductsByCategory } from "../../redux/slices/products/productSlice";
import { Brand } from "../../types/brand"; // Adjust the path based on your project
import { Shop } from "../../types/shop";

const Section7: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    brands,
    shops,
    products,
    selectedCategory,
    categoryType,
    loadingCategories,
    loadingProducts,
  } = useSelector((state: RootState) => state.products);

  const { currentRates } = useSelector(
    (state: RootState) => state.exchangeRate // Extract exchange rates
  );

  // Fetch categories (brands or shops) and products on component mount or when selectedCategory changes
  useEffect(() => {
    if (categoryType === "brands" && !brands.length) {
      dispatch(fetchBrands());
    } else if (categoryType === "shops" && !shops.length) {
      dispatch(fetchShops());
    }
    dispatch(fetchProductsByCategory({ categoryType, category: selectedCategory }));
  }, [dispatch, categoryType, selectedCategory, brands.length, shops.length]);

  return (
    <Container mb="70px">
      <FlexBox>
        {/* Sidebar for Brands/Shops */}
        <Hidden down={768} mr="1.75rem">
          <Box shadow={6} borderRadius={10} padding="1.25rem" bg="white">
            <FlexBox mt="-0.5rem" mb="0.5rem">
              <Typography
                fontWeight="600"
                fontSize="20px"
                padding="0.5rem 1rem"
                style={{ cursor: "pointer" }}
                color={categoryType === "brands" ? "gray.900" : "gray.600"}
                onClick={() => dispatch(fetchProductsByCategory({ categoryType: "brands", category: "" }))}
              >
                Brands
              </Typography>
              <Typography
                fontWeight="600"
                fontSize="20px"
                paddingTop="0.5rem"
                lineHeight="1.3"
                color="gray.400"
              >
                |
              </Typography>
              <Typography
                fontWeight="600"
                fontSize="20px"
                padding="0.5rem 1rem"
                color={categoryType === "shops" ? "gray.900" : "gray.600"}
                style={{ cursor: "pointer" }}
                onClick={() => dispatch(fetchProductsByCategory({ categoryType: "shops", category: "" }))}
              >
                Shops
              </Typography>
            </FlexBox>

            {loadingCategories ? (
              <p>Loading {categoryType}...</p>
            ) : (
              <>
                {(categoryType === "brands" ? brands : shops).map((item: Brand | Shop, ind: number) => (
                  <StyledProductCategory
                    key={item.id}
                    mb="0.75rem"
                    bg={selectedCategory === item.name ? "white" : "gray.100"}
                    shadow={selectedCategory === item.name ? 4 : undefined}
                    onClick={() =>
                      dispatch(
                        fetchProductsByCategory({
                          categoryType,
                          category: selectedCategory === item.name ? "" : item.name,
                        })
                      )
                    }
                  >
                    <LazyImage
                      height={20}
                      width={20}
                      alt={item.name}
                      src={`/assets/images/logos/${ind % 2 === 0 ? "v" : "u"}.png`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <span className="product-category-title">{item.name}</span>
                  </StyledProductCategory>
                ))}
                <StyledProductCategory
                  mt="4rem"
                  bg={selectedCategory === "" ? "white" : "gray.100"}
                  shadow={selectedCategory === "" ? 4 : undefined}
                  onClick={() => dispatch(fetchProductsByCategory({ categoryType, category: "" }))}
                >
                  <span className="product-category-title show-all">View All {categoryType}</span>
                </StyledProductCategory>
              </>
            )}
          </Box>
        </Hidden>

        {/* Product Grid */}
        <Box flex="1 1 0" minWidth="0px">
          <CategorySectionHeader title="Mobile Phones" seeMoreLink="#" />
          {loadingProducts ? (
            <p>Loading Products...</p>
          ) : (
          <Grid container spacing={6}>
            {products.slice(0, 9).map((item) => (
              <Grid item lg={4} sm={6} xs={12} key={item.id}>
                <ProductCard1
                  hoverEffect
                  id={item.id}
                  imgUrl={item.imgUrl || "/assets/images/default-product.png"}
                  title={item.title || "No Title Available"}
                  sellerPrice={item.sellerPrice || 0}
                  buyerPrice={item.buyerPrice || 0}
                  sellerCurrency={item.sellerCurrency || "USD"}
                  buyerCurrency={item.buyerCurrency || "USD"}
                  exchangeRates={
                    currentRates || {
                      baseCurrency: "USD",
                      rates: {},
                    }
                  } // Provide default ExchangeRate object if currentRates is null
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

export default Section7;
