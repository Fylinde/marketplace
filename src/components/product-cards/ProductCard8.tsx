import React from "react";
import { Link } from "react-router-dom";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import Card from "../Card";
import FlexBox from "../FlexBox";
import { H6, SemiSpan } from "../Typography";
// import { DEFAULT_PRODUCT_IMAGE } from "config";

export interface ProductCard8Props {
  id: string; // Unique identifier
  imgUrl?: string; // Optional product image URL
  price?: number; // Optional current price
  title?: string; // Optional product title
  originalPrice?: number; // Optional original price for discount display
  defaultImage?: string; // Optional fallback image
  [key: string]: unknown; // Allow additional props
}

const ProductCard8: React.FC<ProductCard8Props> = ({
  id,
  imgUrl,
  price = 0, // Default price if not provided
  title = "No Title Available", // Default title if not provided
  originalPrice,
  defaultImage = "/assets/images/default-product.png", // Default fallback image
  ...props
}) => {
  return (
    <Card p="1rem" {...props}>
      <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <HoverBox mb="0.75rem" borderRadius={8}>
          <LazyImage
            src={imgUrl || defaultImage} // Use provided imgUrl or fallback image
            borderRadius={8}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            alt={title} // Provide alt text for accessibility
          />
        </HoverBox>
        <SemiSpan
          title={title}
          mb="0.25rem"
          color="inherit"
          ellipsis
          display="block"
        >
          {title}
        </SemiSpan>
        <FlexBox alignItems="center">
          <H6 color="primary.main" mr="0.25rem">
            ${price.toFixed(2)}
          </H6>
          {originalPrice && (
            <SemiSpan color="text.muted" fontSize="12px">
              <del>${originalPrice.toFixed(2)}</del>
            </SemiSpan>
          )}
        </FlexBox>
      </Link>
    </Card>
  );
};

export default ProductCard8;
