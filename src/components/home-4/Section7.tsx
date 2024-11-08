import Box from "components/Box";
import Grid from "components/grid/Grid";
import ProductCard1 from "components/product-cards/ProductCard1";
import { H2 } from "components/Typography";
import productDatabase from "data/product-database";
import React from "react";

export interface Section7Props {}

const Section7: React.FC<Section7Props> = () => {
  const fallbackImg = "/assets/images/default-product.png";

  return (
    <Box mb="3.75rem">
      <H2 mb="1.5rem">Trending Items</H2>

      <Grid container spacing={6}>
        <Grid item md={4} xs={12}>
          {productDatabase[100] ? (
            <ProductCard1
              id="3425442"
              title="KSUS ROG Strix G15"
              price={1100}
              off={undefined}
              imgUrl={productDatabase[100].imgUrl || fallbackImg} // Fallback for imgUrl
            />
          ) : (
            <ProductCard1
              id="3425442"
              title="KSUS ROG Strix G15"
              price={1100}
              off={undefined}
              imgUrl={fallbackImg} // Fallback product
            />
          )}
        </Grid>
        <Grid item md={8} xs={12}>
          <Grid container spacing={6}>
            {productDatabase.slice(169, 175).map((item, ind) =>
              item ? ( // Check if the item exists
                <Grid item lg={4} sm={6} xs={12} key={item.title || ind}>
                  <ProductCard1
                    id={item.id}
                    title={item.title || "No Title Available"} // Fallback for title
                    price={item.price ?? 0} // Fallback for price
                    imgUrl={item.imgUrl || fallbackImg} // Fallback for imgUrl
                    off={ind * 10} // Example discount logic
                  />
                </Grid>
              ) : null
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Section7;
