import React from "react";
import Box from "components/Box";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H4 } from "components/Typography";

export interface ProductCard5Props {
  imgUrl?: string; // Made optional for fallback handling
  title?: string;  // Made optional for fallback handling
}

const ProductCard5: React.FC<ProductCard5Props> = ({
  imgUrl = "/assets/images/default-product.png", // Default image
  title = "No Title Available", // Default title
}) => {
  return (
    <Box>
      <HoverBox borderRadius={5} mb="0.5rem">
        <LazyImage
          src={imgUrl}
          width={260}
          height={175}
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          alt={title}
        />
      </HoverBox>
      <H4 fontSize="14px" fontWeight="600" textAlign="center">
        {title}
      </H4>
    </Box>
  );
};

export default ProductCard5;
