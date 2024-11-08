import React, { useEffect, useState } from "react";
import Box from "../Box";
import Grid from "../grid/Grid";
import ProductCard1 from "../product-cards/ProductCard1";
import { H3 } from "../Typography";
import { getRelatedProducts } from "services/productService"; // Import the API function

export interface RelatedProductsProps {
  productId: string; // Accept productId as a prop to find related products
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch related products when the component mounts or when productId changes
    if (productId) {
      getRelatedProducts(productId)
        .then((response) => setRelatedProducts(response.data))
        .catch((error) => console.error("Failed to fetch related products", error));
    }
  }, [productId]);

  return (
    <Box mb="3.75rem">
      <H3 mb="1.5rem">Related Products</H3>
      <Grid container spacing={8}>
        {relatedProducts.map((item, ind) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
            <ProductCard1 {...item} hoverEffect />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;
