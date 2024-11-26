import React from "react";
import { CSSProperties } from "styled-components";
import Box from "components/Box";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H4, Small } from "components/Typography";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";

export interface ProductCard4Props {
  className?: string;
  style?: CSSProperties;
  imgUrl?: string; // Made optional for fallback
  rating?: number; // Made optional for fallback
  title?: string;  // Made optional for fallback
  price?: number;  // Made optional for fallback
  reviewCount?: number; // Made optional for fallback
}

const ProductCard4: React.FC<ProductCard4Props> = ({
  imgUrl = "/assets/images/default-product.png", // Default image
  rating = 0, // Default rating
  title = "No Title Available", // Default title
  price = 0, // Default price
  reviewCount = 0, // Default review count
}) => {
  return (
    <Box>
      <HoverBox mb="1rem" mx="auto" borderRadius={8}>
        <LazyImage
          src={imgUrl}
          width={300}
          height={300}
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          alt={title}
        />
      </HoverBox>

      <FlexBox justifyContent="center" alignItems="center" mb="0.25rem">
        <Rating value={rating} color="warn" readonly />
        <Small fontWeight="600" pl="0.25rem">
          ({reviewCount})
        </Small>
      </FlexBox>

      <H4
        fontWeight="600"
        fontSize="14px"
        textAlign="center"
        mb="0.25rem"
        title={title}
        ellipsis
      >
        {title}
      </H4>
      <H4
        fontWeight="600"
        fontSize="14px"
        textAlign="center"
        color="primary.main"
      >
        ${Math.ceil(price).toLocaleString()}
      </H4>
    </Box>
  );
};

export default ProductCard4;
