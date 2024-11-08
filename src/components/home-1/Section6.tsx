import LazyImage from "components/LazyImage";
import productDatabase from "data/product-database";
import React, { useState } from "react";
import Box from "../Box";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Hidden from "../hidden/Hidden";
import ProductCard1 from "../product-cards/ProductCard1";
import StyledProductCategory from "./ProductCategoryStyle";

const Section6: React.FC = () => {
  const [selected, setSelected] = useState("");

  const handleCategoryClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const brand = event.currentTarget.id; // Get id from the clicked element
    if (selected.match(brand)) {
      setSelected("");
    } else {
      setSelected(brand);
    }
  };
  

  return (
    <Container mb="80px">
      <FlexBox>
        <Hidden down={768} mr="1.75rem">
          <Box shadow={6} borderRadius={10} padding="1.25rem" bg="white">
            {brandList.map((brand: string, ind) => (
              <StyledProductCategory
                key={brand}
                id={brand}
                mb="0.75rem"
                bg={selected.match(brand) ? "white" : "gray.100"}
                shadow={selected.match(brand) ? 4 : undefined} // Replace null with undefined
                onClick={handleCategoryClick}
              >
                <LazyImage
                  width={20}  // Replace "20px" with number 20
                  height={20} // Replace "20px" with number 20
                  style={{
                    position: "absolute",  // Make the image fill the container
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",  // Ensure it maintains aspect ratio
                  }}

                  src={`/assets/images/logos/${ind % 2 === 0 ? "v" : "u"}.png`}
                  alt="apple"
                />
                <span className="product-category-title">{brand}</span>
              </StyledProductCategory>
            ))}

            <StyledProductCategory
              id="all"
              mt="4rem"
              bg={selected.match("all") ? "white" : "gray.100"}
              shadow={selected.match("all") ? 4 : undefined} // Replace null with undefined
              onClick={handleCategoryClick}
            >
              <span id="all" className="product-category-title show-all">
                View All Brands
              </span>
            </StyledProductCategory>
          </Box>
        </Hidden>

        <Box flex="1 1 0" minWidth="0px">
          <CategorySectionHeader title="Cars" seeMoreLink="#" />
          <Grid container spacing={6}>
            {productDatabase.slice(0, 6).map((item, ind) => (
              <Grid item lg={4} sm={6} xs={12} key={ind}>
                <ProductCard1 hoverEffect {...item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </FlexBox>
    </Container>
  );
};

const brandList = ["zerrari", "fesla", "btw", "boyota", "gini", "lord"];

export default Section6;
