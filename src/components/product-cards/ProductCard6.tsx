import React from "react";
import Card from "../../components/Card";
import { Chip } from "../../components/Chip";
import HoverBox from "../../components/HoverBox";
import LazyImage from "../../components/LazyImage";
import FlexBox from "../../components/FlexBox";
import Button from "../../components/buttons/Button";
import { H4, Small } from "../../components/Typography";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


export interface ProductCard6Props {
  id?: string | number;
  title?: string; // Optional for fallback handling
  subtitle?: string; // Optional for fallback handling
  imgUrl?: string; // Optional for fallback handling
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

const ProductCard6: React.FC<ProductCard6Props> = ({
  id,
  title = "No Title",
  subtitle = "No Subtitle",
  imgUrl = "/assets/images/default-product.png",
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
            objectFit: "contain",
          }}
          alt={title}
        />
      </HoverBox>

      {/* Multi-Currency Prices */}
      <FlexBox justifyContent="space-between" alignItems="center" mt="1rem" px="0.875rem">
        <H4 fontSize="14px" fontWeight="600" color="primary.main">
          {buyerCurrency} {buyerPrice.toFixed(2)}
        </H4>
        <Small fontSize="12px" color="text.muted">
          {sellerCurrency} {sellerPrice.toFixed(2)}
        </Small>
      </FlexBox>

      {/* Chat and TryOn Buttons */}
      <FlexBox justifyContent="space-between" alignItems="center" mt="1rem" px="0.875rem">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={onChatWithSeller}
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
        <FlexBox flexDirection="column" alignItems="flex-start" mt="1rem" px="0.875rem">
          <H4 fontSize="12px" fontWeight="600">
            Reviews:
          </H4>
          {reviews.slice(0, 2).map((review, index) => (
            <Small key={index} color="text.secondary" mb="0.25rem">
              {review.user}: {review.comment} ({review.rating}/5)
            </Small>
          ))}
          {reviews.length > 2 && (
            <Small fontWeight="600" color="primary.main">
              +{reviews.length - 2} more
            </Small>
          )}
        </FlexBox>
      )}
    </Card>
  );
};

export default ProductCard6;
