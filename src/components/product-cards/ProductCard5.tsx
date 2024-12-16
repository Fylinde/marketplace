import React from "react";
import Box from "components/Box";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H4, Small } from "components/Typography";
import FlexBox from "components/FlexBox";
import Button from "components/buttons/Button";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


export interface ProductCard5Props {
  id?: string | number;
  imgUrl?: string; // Optional for fallback handling
  title?: string; // Optional for fallback handling
  sellerPrice?: number; // Seller price
  buyerPrice?: number; // Buyer price
  sellerCurrency?: string; // Seller currency
  buyerCurrency?: string; // Buyer currency
  tryOnAvailable?: boolean; // TryOn availability
  isArEnabled?: boolean;
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  onChatWithSeller?: () => void; // Chat with seller handler
  onTryNow?: () => void; // TryOn handler
}

const ProductCard5: React.FC<ProductCard5Props> = ({
  id,
  imgUrl = "/assets/images/default-product.png",
  title = "No Title Available",
  sellerPrice = 0,
  buyerPrice = 0,
  sellerCurrency = "USD",
  buyerCurrency = "USD",
  tryOnAvailable = false,
  isArEnabled = false,
  reviews = [],
  onChatWithSeller,
  onTryNow,
}) => {
  return (
    <Box>
      {/* Product Image */}
      <HoverBox borderRadius={5} mb="0.5rem">
        <LazyImage
          src={imgUrl}
          width={260}
          height={175}
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          alt={title}
        />
      </HoverBox>

      {/* Product Title */}
      <H4 fontSize="14px" fontWeight="600" textAlign="center" mb="0.5rem">
        {title}
      </H4>

      {/* Multi-Currency Prices */}
      <H4 fontSize="14px" fontWeight="600" textAlign="center" color="primary.main">
        {buyerCurrency} {buyerPrice.toFixed(2)}
      </H4>
      <Small fontSize="12px" textAlign="center" display="block" color="text.muted">
        {sellerCurrency} {sellerPrice.toFixed(2)}
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
          <Button variant="contained" color="primary" size="small" onClick={onTryNow}>
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
              <strong>{review.user}:</strong> {review.comment} ({review.rating}/5)
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

export default ProductCard5;
