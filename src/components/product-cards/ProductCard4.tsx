import React from "react";
import { CSSProperties } from "styled-components";
import Box from "../../components/Box";
import HoverBox from "../../components/HoverBox";
import LazyImage from "../../components/LazyImage";
import { H4, Small } from "../../components/Typography";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";
import Button from "../buttons/Button";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


export interface ProductCard4Props {
  id?: string | number;
  className?: string;
  style?: CSSProperties;
  imgUrl?: string; // Optional for fallback handling
  rating?: number; // Optional for fallback handling
  title?: string; // Optional for fallback handling
  price?: number; // Optional for fallback handling
  sellerPrice?: number; // Seller price
  buyerPrice?: number; // Buyer price
  sellerCurrency?: string; // Seller currency
  buyerCurrency?: string; // Buyer currency
  reviewCount?: number; // Optional for fallback handling
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  tryOnAvailable?: boolean; // TryOn availability
  isArEnabled?: boolean;
  onChatWithSeller?: () => void; // Chat with seller handler
  onTryNow?: () => void; // TryOn handler
}

const ProductCard4: React.FC<ProductCard4Props> = ({
  id,
  imgUrl = "/assets/images/default-product.png",
  rating = 0,
  title = "No Title Available",
  price = 0,
  sellerPrice = 0,
  buyerPrice = 0,
  sellerCurrency = "USD",
  buyerCurrency = "USD",
  reviewCount = 0,
  reviews = [],
  tryOnAvailable = false,
  isArEnabled = false,
  onChatWithSeller,
  onTryNow,
}) => {
  return (
    <Box>
      {/* Product Image */}
      <HoverBox mb="1rem" mx="auto" borderRadius={8}>
        <LazyImage
          src={imgUrl}
          width={300}
          height={300}
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          alt={title}
        />
      </HoverBox>

      {/* Rating and Review Count */}
      <FlexBox justifyContent="center" alignItems="center" mb="0.25rem">
        <Rating value={rating} color="warn" readonly />
        <Small fontWeight="600" pl="0.25rem">
          ({reviewCount})
        </Small>
      </FlexBox>

      {/* Product Title */}
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

      {/* Multi-Currency Prices */}
      <H4
        fontWeight="600"
        fontSize="14px"
        textAlign="center"
        color="primary.main"
      >
        {buyerCurrency} {Math.ceil(buyerPrice).toLocaleString()}
      </H4>
      <Small
        fontSize="12px"
        textAlign="center"
        display="block"
        color="text.muted"
      >
        {sellerCurrency} {Math.ceil(sellerPrice).toLocaleString()}
      </Small>

      {/* Chat and TryOn Buttons */}
      <FlexBox justifyContent="center" mt="1rem">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={onChatWithSeller}
          style={{ marginRight: "8px" }}
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
          <h4>Reviews:</h4>
          {reviews.slice(0, 2).map((review, index) => (
            <p key={index} style={{ fontSize: "12px", margin: "4px 0" }}>
              <strong>{review.user}:</strong> {review.comment} (
              {review.rating}/5)
            </p>
          ))}
          {reviews.length > 2 && (
            <Small fontWeight="600" color="primary.main">
              +{reviews.length - 2} more
            </Small>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProductCard4;
