import React, { useState, useCallback } from "react";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { Chip } from "../Chip";
import { H5, SemiSpan, Small } from "../Typography";
import { StyledProductCard9 } from "./ProductCardStyle";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";
import Modal from "../modal/Modal";
import Card from "../Card";
import ProductIntro from "../products/ProductIntro";

export interface ProductCard9Props {
  id: string | number;
  imgUrl?: string;
  title?: string;
  sellerPrice: number; // Seller price
  buyerPrice: number; // Buyer price
  sellerCurrency: string; // Seller currency
  buyerCurrency: string; // Buyer currency
  off?: number; // Discount percentage
  rating?: number;
  reviews?: { comment: string; rating: number; user: string }[];
  tryOnAvailable?: boolean;
  isArEnabled?: boolean;
  onChatWithSeller?: () => void;
  onTryNow?: () => void;
  subcategories?: Array<{ title: string; url: string }>;
  [key: string]: unknown;
}

const ProductCard9: React.FC<ProductCard9Props> = ({
  id,
  imgUrl = "/assets/images/default.png",
  title = "No Title Available",
  sellerPrice,
  buyerPrice,
  sellerCurrency,
  buyerCurrency,
  off,
  rating = 0,
  reviews = [],
  tryOnAvailable = false,
  isArEnabled = false,
  onChatWithSeller,
  onTryNow,
  subcategories = [],
  ...props
}) => {
  const [quantity, setQuantity] = useState(0); // Tracks the quantity
  const [totalBuyerPrice, setTotalBuyerPrice] = useState(0); // Tracks buyer total price
  const [totalSellerPrice, setTotalSellerPrice] = useState(0); // Tracks seller total price
  const [open, setOpen] = useState(false); // Modal open/close state

  // Toggle modal dialog
  const toggleDialog = useCallback(() => setOpen((prev) => !prev), []);

  // Handle quantity change and update totals
  const handleCartQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity >= 0) {
        setQuantity(newQuantity);
        setTotalBuyerPrice(parseFloat((newQuantity * buyerPrice).toFixed(2)));
        setTotalSellerPrice(parseFloat((newQuantity * sellerPrice).toFixed(2)));
      }
    },
    [buyerPrice, sellerPrice]
  );

  // Calculate discounted prices if applicable
  const discountedBuyerPrice = off
    ? (buyerPrice - (buyerPrice * off) / 100).toFixed(2)
    : buyerPrice.toFixed(2);

  const discountedSellerPrice = off
    ? (sellerPrice - (sellerPrice * off) / 100).toFixed(2)
    : sellerPrice.toFixed(2);

  return (
    <StyledProductCard9 overflow="hidden" width="100%" {...props}>
      <Grid container spacing={1}>
        {/* Product Image */}
        <Grid item md={3} sm={4} xs={12}>
          <Box position="relative">
            {off && (
              <Chip
                position="absolute"
                bg="primary.main"
                color="primary.text"
                fontSize="10px"
                fontWeight="600"
                p="5px 10px"
                top="10px"
                left="10px"
              >
                {off}% off
              </Chip>
            )}
            <Icon
              color="secondary"
              variant="small"
              className="quick-view"
              onClick={toggleDialog}
            >
              eye-alt
            </Icon>
            <img
              src={imgUrl}
              alt={title}
              style={{ width: "100%", borderRadius: "0.5rem" }}
            />
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item md={8} sm={8} xs={12}>
          <FlexBox flexDirection="column" justifyContent="center" height="100%" p="1rem">
            {/* Subcategories */}
            {subcategories.map((item) => (
              <Small key={item.title} color="primary.main">
                {item.title}
              </Small>
            ))}

            {/* Title */}
            <H5 fontWeight="600" my="0.5rem">
              {title}
            </H5>

            {/* Rating */}
            <Rating value={rating} outof={5} color="warn" readonly />

            {/* Multi-Currency Pricing */}
            <FlexBox mt="1rem" mb="1rem" alignItems="center" gap="1rem">
              <H5 fontWeight={600} color="primary.main">
                {buyerCurrency} {discountedBuyerPrice} (Buyer)
              </H5>
              <Small fontSize="12px" color="text.muted">
                ({sellerCurrency} {discountedSellerPrice} Seller)
              </Small>
            </FlexBox>

            {/* Quantity and Total */}
            <FlexBox alignItems="center" mt="1rem" gap="1rem">
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => handleCartQuantityChange(quantity - 1)}
                disabled={quantity === 0}
              >
                -
              </Button>
              <H5>{quantity}</H5>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => handleCartQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </FlexBox>

            {/* Totals */}
            <Box mt="1rem">
              <H5>Total (Buyer): {buyerCurrency} {totalBuyerPrice.toFixed(2)}</H5>
              <Small>Total (Seller): {sellerCurrency} {totalSellerPrice.toFixed(2)}</Small>
            </Box>

            {/* Action Buttons */}
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
            {/* AR Button */}
            <ViewInSpaceButton productId={id} isArEnabled={isArEnabled} />
          </FlexBox>
        </Grid>
      </Grid>

      {/* Modal for Quick View */}
      <Modal open={open} onClose={toggleDialog}>
        <Card p="1rem" position="relative">
          <ProductIntro
            product={{
              id,
              images: [imgUrl],
              title,
              buyerPrice,
              buyerCurrency,
              sellerPrice,
              sellerCurrency,
              stock: 0, // Example placeholder
            }}
          />
          <Box position="absolute" top="0.75rem" right="0.75rem" cursor="pointer">
            <Icon
              className="close"
              color="primary"
              variant="small"
              onClick={toggleDialog}
            >
              close
            </Icon>
          </Box>
        </Card>
      </Modal>
    </StyledProductCard9>
  );
};

export default ProductCard9;
