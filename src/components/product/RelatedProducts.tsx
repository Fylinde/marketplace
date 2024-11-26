import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ProductCard from "./EnhancedProductCard";
import RelatedProductsContainer from "./styles/RelatedProducts.styles";

const RelatedProducts: React.FC<{ productId: string }> = ({ productId }) => {
  const { relatedProducts } = useSelector((state: RootState) => state.products);

  return (
    <RelatedProductsContainer>
      <h3>Related Products</h3>
      {relatedProducts.map((product) => (
        <ProductCard
          key={String(product.id)} // Convert product.id to string
          productId={String(product.id)} // Convert product.id to string
          buyerRegion="US"
          buyerCurrency="USD"
        />
      ))}
    </RelatedProductsContainer>
  );
};

export default RelatedProducts;
