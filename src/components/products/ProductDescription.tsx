import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "../Box";
import Typography, { H3 } from "../Typography";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/slices/products/productSlice";
import { AppDispatch } from "../../redux/store";
import { Product } from "../../types/Product";

export interface ProductDescriptionProps {
  description?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      // Dispatch fetchProducts with appropriate parameters
      dispatch(fetchProducts({ filters: {}, page: 1 }))
        .unwrap() // Unwrap the result
        .then((response) => {
          const foundProduct = response.data.find((p: Product) => p.id === id);
          if (!foundProduct) {
            throw new Error(`Product with id ${id} not found`);
          }
          setProduct(foundProduct); // Assign the extracted product
        })
        .catch((error) => {
          console.error("Failed to fetch product details", error);
        });
    }
  }, [id, dispatch]);

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
