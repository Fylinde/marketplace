import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get the product ID from the URL
import Box from "../Box";
import Typography, { H3 } from "../Typography";
import { getProducts } from "services/productService";
export interface ProductDescriptionProps {}

const ProductDescription: React.FC<ProductDescriptionProps> = () => {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Fetch product details by ID
      getProducts(id)
        .then((response) => setProduct(response.data))
        .catch((error) => console.error("Failed to fetch product details", error));
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <Box>
      <H3 mb="1rem">Specification:</H3>
      <Typography>
        Brand: {product.brand || "N/A"} <br />
        Model: {product.model || "N/A"} <br />
        {product.features?.join(", ") || "No additional features"} <br />
        Frequency Response: {product.frequency || "N/A"} <br />
        Origin: {product.origin || "N/A"} <br />
      </Typography>
    </Box>
  );
};

export default ProductDescription;
