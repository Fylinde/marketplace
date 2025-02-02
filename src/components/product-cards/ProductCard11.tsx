import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Box from "../../components/Box";
import FlexBox from "../../components/FlexBox";
import LazyImage from "../../components/LazyImage";
import Rating from "../../components/rating/Rating";
import Button from "../../components/buttons/Button";
import { H6, SemiSpan, Small } from "../../components/Typography";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


export interface ProductCard11Props {
  id: string | number;
  imgUrl?: string;
  title?: string;
  productUrl?: string;
  price?: number;
  oldPrice?: number;
  buyerPrice?: number; // Buyer price
  sellerPrice?: number; // Seller price
  buyerCurrency?: string; // Buyer currency
  sellerCurrency?: string; // Seller currency
  rating?: number;
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  tryOnAvailable?: boolean; // TryOn availability
  isArEnabled?: boolean;
  onChatWithSeller?: () => void; // Chat with seller handler
  onTryNow?: () => void; // TryOn handler
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
  id,
  imgUrl = "/assets/images/default.png",
  title = "Product Title",
  productUrl = "/",
  price = 0,
  buyerPrice = 0,
  sellerPrice = 0,
  buyerCurrency = "USD",
  sellerCurrency = "USD",
  oldPrice,
  rating = 0,
  reviews = [],
  tryOnAvailable = false,
  isArEnabled = false,
  onChatWithSeller,
  onTryNow,
}) => {
  return (
    <StyledProductCard>
      <Link to={productUrl}>
        {/* Product Image */}
        <Box className="image-holder" mb="1rem">
          <LazyImage
            src={imgUrl}
            alt={title}
            style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          />
        </Box>
      </Link>

      {/* Product Rating */}
      <Box mb="0.5rem">
        <Rating value={rating} outof={5} color="warn" readonly />
      </Box>

      {/* Product Title */}
      <H6 className="ellipsis" mb="6px" title={title}>
        {title}
      </H6>

      {/* Multi-Currency Prices */}
      <FlexBox alignItems="center" mb="1rem">
        <SemiSpan pr="0.25rem" fontWeight="600" color="primary.main">
          {buyerCurrency} {buyerPrice.toLocaleString()}
        </SemiSpan>
        <Small fontSize="12px" color="text.muted" lineHeight="1.3">
          ({sellerCurrency} {sellerPrice.toLocaleString()})
        </Small>
        {oldPrice && (
          <Small color="text.muted" lineHeight="1.3">
            <del>${oldPrice.toLocaleString()}</del>
          </Small>
        )}
      </FlexBox>

      {/* Chat and TryOn Buttons */}
      <FlexBox justifyContent="space-between">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={onChatWithSeller}
        >
          Chat with Seller
        </Button>
        {tryOnAvailable && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onTryNow}
          >
            Try Now
          </Button>
        )}
      </FlexBox>
        {/* View in AR */}
        <ViewInSpaceButton productId={id} isArEnabled={isArEnabled} />

      {/* Localized Reviews */}
      {reviews.length > 0 && (
        <Box mt="1rem">
          <H6 fontSize="14px" mb="0.5rem">
            Reviews:
          </H6>
          {reviews.slice(0, 2).map((review, index) => (
            <Small key={index} fontSize="12px" color="text.secondary" mb="0.25rem">
              {review.user}: {review.comment} ({review.rating}/5)
            </Small>
          ))}
          {reviews.length > 2 && (
            <Small fontSize="12px" fontWeight="600" color="primary.main">
              +{reviews.length - 2} more reviews
            </Small>
          )}
        </Box>
      )}
    </StyledProductCard>
  );
};

export default ProductCard11;
