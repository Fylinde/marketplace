import React, { Fragment, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { CSSProperties } from "styled-components";
import LazyImage from "../../components/LazyImage";
import Box from "../Box";
import Button from "../buttons/Button";
import Card from "../Card";
import { Chip } from "../Chip";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Modal from "../modal/Modal";
import ProductIntro from "../products/ProductIntro";
import { H3, SemiSpan, Small } from "../Typography";
import { StyledProductCard1 } from "./ProductCardStyle";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";

export interface ProductCard10Props {
  id: string | number;
  className?: string;
  style?: CSSProperties;
  imgUrl?: string;
  title?: string;
  sellerPrice?: number; // Seller price
  buyerPrice?: number; // Buyer price
  sellerCurrency?: string; // Seller currency
  buyerCurrency?: string; // Buyer currency
  off?: number;
  subcategories?: Array<{
    title: string;
    url: string;
  }>;
  rating?: number;
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  tryOnAvailable?: boolean; // TryOn availability
  isArEnabled?: boolean;
  onChatWithSeller?: () => void; // Chat with seller handler
  onTryNow?: () => void; // TryOn handler
}

const ProductCard10: React.FC<ProductCard10Props> = ({
  id,
  imgUrl = "/assets/images/products/macbook.png",
  title = "Product Title",
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
  const [quantity, setQuantity] = useState(0);
  const [totalSellerPrice, setTotalSellerPrice] = useState(0); // Tracks total in seller's currency
  const [totalBuyerPrice, setTotalBuyerPrice] = useState(0); // Tracks total in buyer's currency
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => setOpen((prev) => !prev), []);

  const handleCartQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity >= 0) {
        setQuantity(newQuantity);
        setTotalSellerPrice(parseFloat((newQuantity * sellerPrice).toFixed(2)));
        setTotalBuyerPrice(parseFloat((newQuantity * buyerPrice).toFixed(2)));
      }
    },
    [sellerPrice, buyerPrice]
  );

  const discountedSellerPrice =
    off && sellerPrice
      ? (sellerPrice - (sellerPrice * off) / 100).toFixed(2)
      : sellerPrice.toFixed(2);

  const discountedBuyerPrice =
    off && buyerPrice
      ? (buyerPrice - (buyerPrice * off) / 100).toFixed(2)
      : buyerPrice.toFixed(2);

  return (
    <StyledProductCard1 {...props}>
      <div className="image-holder">
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

        <FlexBox className="extra-icons">
          <Icon color="secondary" variant="small" mb="0.5rem" onClick={toggleDialog}>
            eye-alt
          </Icon>
          <Icon className="favorite-icon outlined-icon" variant="small">
            heart
          </Icon>
        </FlexBox>

        <Link to={`/product/${title}`}>
          <LazyImage
            src={imgUrl}
            width={500}
            height={500}
            style={{ width: "100%", height: "auto", borderRadius: "4px" }}
            alt={title}
          />
        </Link>
      </div>

      <div className="details">
        <FlexBox>
          <Box flex="1 1 0" minWidth="0px" mr="0.5rem">
            <Link to={`/product/${title}`}>
              <H3
                className="title"
                fontSize="14px"
                textAlign="left"
                fontWeight="600"
                color="text.secondary"
                mb="6px"
                title={title}
              >
                {title}
              </H3>
            </Link>

            <FlexBox alignItems="center" mt="6px">
              <Small pr="0.5rem" fontWeight="600" color="primary.main">
                {buyerCurrency} {discountedBuyerPrice}
              </Small>
              <Small fontSize="12px" color="text.muted">
                ({sellerCurrency} {discountedSellerPrice})
              </Small>
            </FlexBox>
          </Box>

          <FlexBox
            flexDirection="column-reverse"
            alignItems="center"
            justifyContent={quantity ? "space-between" : "flex-start"}
            width="30px"
          >
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="small"
              borderColor="primary.light"
              onClick={() => handleCartQuantityChange(quantity + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>

            {quantity > 0 && (
              <Fragment>
                <SemiSpan color="text.primary" fontWeight="600">
                  {quantity}
                </SemiSpan>
                <Button
                  variant="outlined"
                  color="primary"
                  padding="5px"
                  size="small"
                  borderColor="primary.light"
                  onClick={() => handleCartQuantityChange(quantity - 1)}
                >
                  <Icon variant="small">minus</Icon>
                </Button>
              </Fragment>
            )}
          </FlexBox>
        </FlexBox>

        <FlexBox justifyContent="space-between" mt="1rem">
          <H3>Total (Buyer): {buyerCurrency} {totalBuyerPrice.toFixed(2)}</H3>
          <Small>Total (Seller): {sellerCurrency} {totalSellerPrice.toFixed(2)}</Small>
        </FlexBox>

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

        {reviews.length > 0 && (
          <Box mt="1rem">
            <H3 fontSize="14px" mb="0.5rem">
              Reviews:
            </H3>
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
      </div>

      <Modal open={open} onClose={toggleDialog}>
        <Card p="1rem" position="relative">
          <ProductIntro
            product={{
              id,
              images: [imgUrl],
              title,
              sellerPrice,
              buyerPrice,
              buyerCurrency,
              sellerCurrency,
              brand: undefined,
              stock: 0, // Default stock value
            }}
          />
          <Box position="absolute" top="0.75rem" right="0.75rem" cursor="pointer">
            <Icon className="close" color="primary" variant="small" onClick={toggleDialog}>
              close
            </Icon>
          </Box>
        </Card>
      </Modal>
    </StyledProductCard1>
  );
};

export default ProductCard10;
