import React from "react";
import { Link } from "react-router-dom";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import Card from "../Card";
import FlexBox from "../FlexBox";
import Button from "../buttons/Button";
import { H6, SemiSpan, Small } from "../Typography";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


export interface ProductCard8Props {
  id: string; // Unique identifier
  imgUrl?: string; // Optional product image URL
  price?: number; // Current price
  sellerPrice?: number; // Seller price
  buyerPrice?: number; // Buyer price
  sellerCurrency?: string; // Seller currency
  buyerCurrency?: string; // Buyer currency
  title?: string; // Optional product title
  originalPrice?: number; // Original price for discount display
  defaultImage?: string; // Optional fallback image
  tryOnAvailable?: boolean; // TryOn availability
  isArEnabled?: boolean;
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  onChatWithSeller?: () => void; // Chat with seller handler
  onTryNow?: () => void; // TryOn handler
  [key: string]: unknown; // Allow additional props
}

const ProductCard8: React.FC<ProductCard8Props> = ({
  id,
  imgUrl,
  price = 0, // Default price
  sellerPrice = 0, // Default seller price
  buyerPrice = 0, // Default buyer price
  sellerCurrency = "USD", // Default seller currency
  buyerCurrency = "USD", // Default buyer currency
  title = "No Title Available", // Default title
  originalPrice,
  defaultImage = "/assets/images/default-product.png", // Default fallback image
  tryOnAvailable = false, // Default TryOn availability
  isArEnabled = false,
  reviews = [], // Default reviews
  onChatWithSeller,
  onTryNow,
  ...props
}) => {
  return (
    <Card p="1rem" {...props}>
      <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {/* Product Image */}
        <HoverBox mb="0.75rem" borderRadius={8}>
          <LazyImage
            src={imgUrl || defaultImage}
            borderRadius={8}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            alt={title}
          />
        </HoverBox>

        {/* Product Title */}
        <SemiSpan
          title={title}
          mb="0.25rem"
          color="inherit"
          ellipsis
          display="block"
        >
          {title}
        </SemiSpan>

        {/* Multi-Currency Prices */}
        <FlexBox alignItems="center" mb="0.5rem">
          <H6 color="primary.main" mr="0.25rem">
            {buyerCurrency} {buyerPrice.toFixed(2)}
          </H6>
          <Small color="text.muted" fontSize="12px">
            ({sellerCurrency} {sellerPrice.toFixed(2)})
          </Small>
          {originalPrice && (
            <SemiSpan color="text.muted" fontSize="12px">
              <del>${originalPrice.toFixed(2)}</del>
            </SemiSpan>
          )}
        </FlexBox>
      </Link>

      {/* Chat and TryOn Buttons */}
      <FlexBox justifyContent="space-between" mt="1rem">
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
        <FlexBox flexDirection="column" alignItems="flex-start" mt="1rem">
          <Small fontWeight="600" color="text.secondary" mb="0.5rem">
            Reviews:
          </Small>
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
        </FlexBox>
      )}
    </Card>
  );
};

export default ProductCard8;
