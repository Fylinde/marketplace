import React, { Fragment, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { CSSProperties } from "styled-components";
import Box from "../Box";
import Button from "../buttons/Button";
import Card from "../Card";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Hidden from "../hidden/Hidden";
import Icon from "../icon/Icon";
import Modal from "../modal/Modal";
import NavLink from "../nav-link/NavLink";
import ProductIntro from "../products/ProductIntro";
import Rating from "../rating/Rating";
import { Chip } from "components/Chip";
import { H5, SemiSpan, Small } from "../Typography";
import { StyledProductCard9 } from "./ProductCardStyle";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


export interface ProductCard9Props {
  id: string | number;
  className?: string;
  style?: CSSProperties;
  imgUrl?: string;
  title?: string;
  price?: number;
  sellerPrice?: number; // Seller price
  buyerPrice?: number; // Buyer price
  sellerCurrency?: string; // Seller currency
  buyerCurrency?: string; // Buyer currency
  off?: number;
  subcategories?: Array<{ title: string; url: string }>;
  rating?: number;
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  tryOnAvailable?: boolean; // TryOn availability
  isArEnabled?: boolean;
  onChatWithSeller?: () => void; // Chat with seller handler
  onTryNow?: () => void; // TryOn handler
  [key: string]: unknown;
}

const ProductCard9: React.FC<ProductCard9Props> = ({
  id,
  imgUrl = "/assets/images/default.png",
  title = "No Title Available",
  price = 0,
  sellerPrice = 0,
  buyerPrice = 0,
  sellerCurrency = "USD",
  buyerCurrency = "USD",
  off,
  subcategories,
  rating = 0,
  reviews = [],
  tryOnAvailable = false,
  isArEnabled = false,
  onChatWithSeller,
  onTryNow,
  ...props
}) => {
  const [cartAmount, setCartAmount] = useState(0);
  const [open, setOpen] = useState(false);

  // Toggle dialog for modal view
  const toggleDialog = useCallback(() => setOpen((prev) => !prev), []);

  // Handle cart amount changes
  const handleCartAmountChange = useCallback(
    (amount: number) => {
      if (amount >= 0) setCartAmount(amount);
    },
    []
  );

  const discountedPrice = off
    ? (price - (price * off) / 100).toFixed(2)
    : price.toFixed(2);

  return (
    <StyledProductCard9 overflow="hidden" width="100%" {...props}>
      <Grid container spacing={1}>
        {/* Product Image and Discount */}
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
            {subcategories?.map((item) => (
              <NavLink key={item.title} className="link" to={item.url}>
                {item.title}
              </NavLink>
            ))}

            {/* Title */}
            <Link to={`/product/${title}`}>
              <H5 fontWeight="600" my="0.5rem">
                {title}
              </H5>
            </Link>

            {/* Rating */}
            <Rating value={rating} outof={5} color="warn" readonly />

            {/* Multi-Currency Pricing */}
            <FlexBox mt="0.5rem" mb="1rem" alignItems="center">
              <H5 fontWeight={600} color="primary.main" mr="0.5rem">
                {buyerCurrency} {buyerPrice.toFixed(2)}
              </H5>
              <Small fontSize="12px" color="text.muted">
                ({sellerCurrency} {sellerPrice.toFixed(2)})
              </Small>
              {off && (
                <SemiSpan fontWeight="600">
                  <del>${price.toFixed(2)}</del>
                </SemiSpan>
              )}
            </FlexBox>

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
              <Box mt="1rem">
                <H5 fontSize="14px" mb="0.5rem">
                  Reviews:
                </H5>
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
          </FlexBox>
        </Grid>
      </Grid>

      {/* Quick View Modal */}
      <Modal open={open} onClose={toggleDialog}>
        <Card p="1rem" position="relative">
          <ProductIntro
            product={{
              id: title, // Assuming title acts as an id
              images: [imgUrl], // Pass imgUrl as an array
              title,
              price,
              brand: undefined, // Update with actual brand if available
              stock: undefined, // Update with actual stock if available
            }}
          />
          <Box position="absolute" top="0.75rem" right="0.75rem" cursor="pointer">
            <Icon className="close" color="primary" variant="small" onClick={toggleDialog}>
              close
            </Icon>
          </Box>
        </Card>
      </Modal>
    </StyledProductCard9>
  );
};

export default ProductCard9;
