import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { SpaceProps } from "styled-system";
import Box from "components/Box";
import Image from "components/Image";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Typography from "../Typography";
import { StyledProductCard7 } from "./ProductCardStyle";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


export interface ProductCard7Props {
  id: string | number;
  name: string;
  quantity: number;
  imgUrl?: string;
  sellerPrice?: number; // Seller price
  buyerPrice?: number; // Buyer price
  sellerCurrency?: string; // Seller currency
  buyerCurrency?: string; // Buyer currency
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  tryOnAvailable?: boolean; // TryOn availability
  isArEnabled?: boolean;
  onChatWithSeller?: () => void; // Chat with seller handler
  onTryNow?: () => void; // TryOn handler
  removeItem?: () => void; // Optional prop for removing an item
  updateQuantity?: (quantity: number) => void; // Optional prop for updating quantity
  [key: string]: any; // Allow extensibility
}

const ProductCard7: React.FC<ProductCard7Props & SpaceProps> = ({
  id,
  name,
  quantity,
  imgUrl = "/assets/images/products/iphone-xi.png",
  sellerPrice = 0,
  buyerPrice = 0,
  sellerCurrency = "USD",
  buyerCurrency = "USD",
  reviews = [],
  tryOnAvailable = false,
  isArEnabled = false,
  onChatWithSeller,
  onTryNow,
  removeItem,
  updateQuantity,
  ...props
}) => {
  const handleCartAmountChange = useCallback(
    (amount: number) => {
      // Handle cart amount change logic dynamically
      console.log(`Cart updated for product ${id}: new amount ${amount}`);
    },
    [id]
  );

  return (
    <StyledProductCard7 {...props}>
      {/* Product Image */}
      <Image src={imgUrl} size={140} display="block" alt={name} />
      <FlexBox
        className="product-details"
        flexDirection="column"
        justifyContent="space-between"
        minWidth="0px"
        width="100%"
      >
        {/* Product Title */}
        <Link to={`/product/${id}`}>
          <Typography
            className="title"
            fontWeight="600"
            fontSize="18px"
            mb="0.5rem"
          >
            {name}
          </Typography>
        </Link>

        {/* Remove from Cart Button */}
        <Box position="absolute" right="1rem" top="1rem">
          <IconButton
            padding="4px"
            ml="12px"
            onClick={() => handleCartAmountChange(0)} // Remove product
          >
            <Icon size="1.25rem">close</Icon>
          </IconButton>
        </Box>

        {/* Pricing and Quantity */}
        <FlexBox justifyContent="space-between" alignItems="flex-end">
          <FlexBox flexWrap="wrap" alignItems="center">
            <Typography color="gray.600" mr="0.5rem">
              {buyerCurrency} {buyerPrice.toFixed(2)} x {quantity}
            </Typography>
            <Typography fontWeight={600} color="primary.main" mr="1rem">
              {buyerCurrency} {(buyerPrice * quantity).toFixed(2)}
            </Typography>
            <Typography fontSize="12px" color="text.muted">
              ({sellerCurrency} {(sellerPrice * quantity).toFixed(2)})
            </Typography>
          </FlexBox>

          {/* Quantity Controls */}
          <FlexBox alignItems="center">
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="small"
              borderColor="primary.light"
              onClick={() => handleCartAmountChange(quantity - 1)}
              disabled={quantity === 1}
            >
              <Icon variant="small">minus</Icon>
            </Button>
            <Typography mx="0.5rem" fontWeight="600" fontSize="15px">
              {quantity}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="small"
              borderColor="primary.light"
              onClick={() => handleCartAmountChange(quantity + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>
          </FlexBox>
        </FlexBox>

        {/* Chat and TryOn Buttons */}
        <FlexBox justifyContent="space-between" alignItems="center" mt="1rem">
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
            <Typography fontWeight="600" fontSize="14px" mb="0.5rem">
              Reviews:
            </Typography>
            {reviews.slice(0, 2).map((review, index) => (
              <Typography
                key={index}
                fontSize="12px"
                color="text.secondary"
                mb="0.25rem"
              >
                {review.user}: {review.comment} ({review.rating}/5)
              </Typography>
            ))}
            {reviews.length > 2 && (
              <Typography fontSize="12px" fontWeight="600" color="primary.main">
                +{reviews.length - 2} more reviews
              </Typography>
            )}
          </Box>
        )}
      </FlexBox>
    </StyledProductCard7>
  );
};

export default ProductCard7;
