import Card from 'components/Card';
import { Chip } from 'components/Chip';
import HoverBox from 'components/HoverBox';
import LazyImage from 'components/LazyImage';
import React from 'react';

export interface ProductCard6Props {
  imgUrl: string;
  title: string;
  subtitle: string;
}

const ProductCard6: React.FC<ProductCard6Props> = ({
  title,
  subtitle,
  imgUrl,
}) => {
  return (
    <Card position="relative">
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

      <HoverBox position="relative" height="120px" borderRadius={8} width="100%">
        {/* Ensure that width and height are defined for LazyImage when using layout="fill" */}
        <LazyImage
          src={imgUrl}
          style={{
            position: "absolute",  // Make the image fill the container
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",  // Ensure it maintains aspect ratio
          }}

          alt={title} // Adding alt text for accessibility
        />
      </HoverBox>
    </Card>
  );
};

export default ProductCard6;
