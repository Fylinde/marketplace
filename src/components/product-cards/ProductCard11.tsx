
import Box from "components/Box";
import FlexBox from "components/FlexBox";
import LazyImage from "components/LazyImage";
import Rating from "components/rating/Rating";
import { H6, SemiSpan, Small } from "components/Typography";
import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";

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
  imgUrl,
  title,
  productUrl,
  price,
  oldPrice,
  rating,
}) => {
  return (
    <Link to={productUrl || "/"}>
      <a>
        <StyledProductCard>
          <Box className="image-holder">
            <LazyImage
              // Provide a default fallback image if imgUrl is undefined
              src={imgUrl || "/assets/images/default.png"}  
              alt={title || "Product Image"}  // Add the alt attribute
              width={undefined} // Set to undefined or a number like 500
              height={undefined} // Set to undefined or a number like 500
              style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              mb="1rem"
            />
          </Box>

          <Box mb="0.5rem">
            <Rating value={rating} outof={5} color="warn" readonly />
          </Box>

          <H6 className="ellipsis" mb="6px" title={title || "Product Title"}>
            {title || "Product Title"}  {/* Fallback title */}
          </H6>

          <FlexBox alignItems="center">
            <SemiSpan pr="0.25rem" fontWeight="600" color="primary.main">
              ${price?.toLocaleString() || "0"} {/* Fallback price */}
            </SemiSpan>

            {oldPrice && (
              <Small color="text.muted" lineHeight="1.3">
                ${oldPrice}
              </Small>
            )}
          </FlexBox>
        </StyledProductCard>
      </a>
    </Link>
  );
};

// Default values for props
ProductCard11.defaultProps = {
  rating: 5,
  price: 1300,
  oldPrice: 1500,
  imgUrl: "/assets/images/products/mask.png",
  title: "Blutooth Speaker",
  productUrl: "/product/324523",
};

export default ProductCard11;
