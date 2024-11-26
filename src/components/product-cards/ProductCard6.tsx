import React from "react";
import Card from "components/Card";
import { Chip } from "components/Chip";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";

export interface ProductCard6Props {
  imgUrl?: string; // Made optional for fallback handling
  title?: string;  // Made optional for fallback handling
  subtitle?: string; // Made optional for fallback handling
}

const ProductCard6: React.FC<ProductCard6Props> = ({
  title = "No Title", // Default title
  subtitle = "No Subtitle", // Default subtitle
  imgUrl = "/assets/images/default-product.png", // Default image
}) => {
  return (
    <Card position="relative">
      {/* Title Chip */}
      <Chip
        bg="secondary.main"
        position="absolute"
        color="white"
        fontWeight="600"
        fontSize="10px"
        p="4px 10px"
        top="0.875rem"
        left="0.875rem"
        style={{ zIndex: 2 }}
      >
        {title}
      </Chip>

      {/* Subtitle Chip */}
      <Chip
        bg="gray.300"
        position="absolute"
        color="gray.800"
        fontWeight="600"
        fontSize="10px"
        p="4px 10px"
        top="0.875rem"
        right="0.875rem"
        style={{ zIndex: 2 }}
      >
        {subtitle}
      </Chip>

      {/* Product Image */}
      <HoverBox position="relative" height="120px" borderRadius={8} width="100%">
        <LazyImage
          src={imgUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain", // Maintain aspect ratio
          }}
          alt={title}
        />
      </HoverBox>
    </Card>
  );
};

export default ProductCard6;
