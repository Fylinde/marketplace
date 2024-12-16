import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "../Box";
import Typography, { H3 } from "../Typography";
import { getProducts } from "services/productService";
import { Product } from "../../types/Product"; // Ensure the type matches the API response

export interface ProductDescriptionProps {
  description?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      getProducts(id)
        .then((response) => {
          const product = response.products.find((p: Product) => p.id === id);
          if (!product) {
            throw new Error(`Product with id ${id} not found`);
          }
          setProduct(product); // Assign the extracted product
        })
        .catch((error) => console.error("Failed to fetch product details", error));
    }
  }, [id]);
  

  if (!product) return <p>Loading...</p>;

  return (
    <Box>
      <H3 mb="1rem">Specification:</H3>
      <Typography>
        {description} <br />
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
