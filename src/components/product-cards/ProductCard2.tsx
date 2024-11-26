import React from "react";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H4 } from "components/Typography";
import { Link } from "react-router-dom";

export interface ProductCard2Props {
  imgUrl?: string; // Made optional for fallback handling
  title?: string;  // Made optional for fallback handling
  price?: number;  // Made optional for fallback handling
  productUrl: string;
}

const ProductCard2: React.FC<ProductCard2Props> = ({
  imgUrl = "/assets/images/default-product.png", // Default image
  title = "Product Title", // Default title
  price = 0, // Default price
  productUrl,
}) => {
  return (
    <Link to={productUrl} style={{ textDecoration: "none", color: "inherit" }}>
      <HoverBox borderRadius={8} mb="0.5rem">
        <LazyImage
          src={imgUrl}
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          alt={title}
        />
      </HoverBox>
      <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
        {title}
      </H4>
      <H4 fontWeight="600" fontSize="14px" color="primary.main">
        ${Math.ceil(price).toLocaleString()}
      </H4>
    </Link>
  );
};

export default ProductCard2;
