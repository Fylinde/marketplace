import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchShops, fetchProductsByType } from "../../redux/slices/products/productSlice";
import { RootState, AppDispatch } from "redux/store"; // Adjust path based on your project structure
import { fetchBrands } from "../../redux/slices/products/brandSlice";
import { Shop } from "types/shop";
import { Brand } from "types/brand";

const Section9: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shops, products, loadingShops, loadingProducts } = useSelector(
    (state: RootState) => state.products
  );
  const { brands, loadingBrands } = useSelector(
    (state: RootState) => state.brands
  );

  const [type, setType] = useState<"brands" | "shops">("shops");
  const [selected, setSelected] = useState<string>("");

  // Determine the current list dynamically
  const currentList = type === "brands" ? brands : shops;

  // Handle category selection
  const handleCategoryClick = (item: string) => {
    setSelected(selected === item ? "" : item);
  };

  // Fetch brands, shops, and products dynamically based on type and selection
  useEffect(() => {
    if (type === "brands" && !brands.length) {
      dispatch(fetchBrands());
    } else if (type === "shops" && !shops.length) {
      dispatch(fetchShops());
    }
    dispatch(fetchProductsByType({ type, filter: selected }));
  }, [type, selected, dispatch, brands.length, shops.length]);

  return (
    <Container mb="70px">
      <FlexBox>
        {/* Sidebar for brands/shops */}
        <Hidden down={768} mr="1.75rem">
          <Box shadow={6} borderRadius={10} padding="1.25rem" bg="white">
            <FlexBox mt="-0.5rem" mb="0.5rem">
              <Typography
                fontWeight="600"
                fontSize="20px"
                padding="0.5rem 1rem"
                style={{ cursor: "pointer" }}
                color={type === "brands" ? "gray.900" : "gray.600"}
                onClick={() => setType("brands")}
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
                color={type === "shops" ? "gray.900" : "gray.600"}
                style={{ cursor: "pointer" }}
                onClick={() => setType("shops")}
              >
                Shops
              </Typography>
            </FlexBox>

            {(loadingBrands || loadingShops) ? (
              <p>Loading {type}...</p>
            ) : (
              currentList.map((item: Brand | Shop, ind: number) => (
                <StyledProductCategory
                  key={item.id} // Use unique `id`
                  mb="0.75rem"
                  bg={selected === item.id ? "white" : "gray.100"}
                  shadow={selected === item.id ? 4 : undefined}
                  onClick={() => handleCategoryClick(item.id)}
                >
                  <LazyImage
                    height={20}
                    width={20}
                    src={`/assets/images/logos/${ind % 2 === 0 ? "v" : "u"}.png`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    alt={item.name}
                  />
                  <span className="product-category-title">{item.name}</span>
                </StyledProductCategory>
              ))
            )}

            <StyledProductCategory
              mt="4rem"
              bg={selected === `all-${type}` ? "white" : "gray.100"}
              shadow={selected === `all-${type}` ? 4 : undefined}
              onClick={() => setSelected("")}
            >
              <span className="product-category-title show-all">
                View All {type}
              </span>
            </StyledProductCategory>
          </Box>
        </Hidden>

        {/* Product Grid */}
        <Box flex="1 1 0" minWidth="0px">
          <CategorySectionHeader title="Optics / Watch" seeMoreLink="#" />
          {loadingProducts ? (
            <p>Loading Products...</p>
          ) : (
            <Grid container spacing={6}>
              {products.map((item, ind) => (
                <Grid item lg={4} sm={6} xs={12} key={item.id || ind}>
                  <ProductCard1
                    hoverEffect
                    id={item.id}
                    imgUrl={item.imgUrl || "/assets/images/default-product.png"}
                    title={item.title || "No Title Available"}
                    price={item.price ?? 0}
                    sellerPrice={item.sellerPrice}
                    buyerPrice={item.buyerPrice}
                    sellerCurrency={item.sellerCurrency}
                    buyerCurrency={item.buyerCurrency}
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

export default Section9;
