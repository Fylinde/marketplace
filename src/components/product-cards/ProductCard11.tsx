import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Box from "components/Box";
import FlexBox from "components/FlexBox";
import LazyImage from "components/LazyImage";
import Rating from "components/rating/Rating";
import { H6, SemiSpan, Small } from "components/Typography";

export interface ProductCard11Props {
  imgUrl?: string;
  title?: string;
  productUrl?: string;
  price?: number;
  oldPrice?: number;
  rating?: number;
}

const StyledProductCard = styled.div`
  .image-holder {
    position: relative;
    :after {
      content: " ";
      position: absolute;
      transition: all 250ms ease-in-out;
    }
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :hover {
    .image-holder:after {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.07);
    }
  }
`;

const ProductCard11: React.FC<ProductCard11Props> = ({
  imgUrl = "/assets/images/default.png", // Default fallback image
  title = "Product Title", // Default fallback title
  productUrl = "/", // Default fallback URL
  price = 0, // Default fallback price
  oldPrice,
  rating = 0, // Default fallback rating
}) => {
  return (
    <Link to={productUrl}>
      <StyledProductCard>
        <Box className="image-holder" mb="1rem">
          <LazyImage
            src={imgUrl}
            alt={title}
            style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          />
        </Box>

        <Box mb="0.5rem">
          <Rating value={rating} outof={5} color="warn" readonly />
        </Box>

        <H6 className="ellipsis" mb="6px" title={title}>
          {title}
        </H6>

        <FlexBox alignItems="center">
          <SemiSpan pr="0.25rem" fontWeight="600" color="primary.main">
            ${price.toLocaleString()} {/* Fallback price formatting */}
          </SemiSpan>

          {oldPrice && (
            <Small color="text.muted" lineHeight="1.3">
              <del>${oldPrice.toLocaleString()}</del>
            </Small>
          )}
        </FlexBox>
      </StyledProductCard>
    </Link>
  );
};

export default ProductCard11;
