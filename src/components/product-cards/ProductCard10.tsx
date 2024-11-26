import React, { Fragment, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { CSSProperties } from "styled-components";
import LazyImage from "components/LazyImage";
import Box from "../Box";
import Button from "../buttons/Button";
import Card from "../Card";
import { Chip } from "../Chip";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Modal from "../modal/Modal";
import ProductIntro from "../products/ProductIntro";
import { H3, SemiSpan } from "../Typography";
import { StyledProductCard1 } from "./ProductCardStyle";

export interface ProductCard10Props {
  className?: string;
  style?: CSSProperties;
  imgUrl?: string;
  title?: string;
  price?: number;
  off?: number;
  rating?: number;
  subcategories?: Array<{
    title: string;
    url: string;
  }>;
}

const ProductCard10: React.FC<ProductCard10Props> = ({
  imgUrl = "/assets/images/products/macbook.png", // Default image
  title = "Product Title", // Default title
  price = 0, // Default price
  off,
  subcategories,
  rating = 0, // Default rating
  ...props
}) => {
  const [cartAmount, setCartAmount] = useState(0);
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => setOpen((prev) => !prev), []);

  const handleCartAmountChange = useCallback(
    (amount: number) => {
      if (amount >= 0) setCartAmount(amount);
    },
    []
  );

  const discountedPrice =
    off && price
      ? (price - (price * off) / 100).toFixed(2)
      : price.toFixed(2);

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

            <SemiSpan>300ml</SemiSpan>

            <FlexBox alignItems="center" mt="6px">
              <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                ${discountedPrice}
              </SemiSpan>
              {off && (
                <SemiSpan color="text.muted" fontWeight="600">
                  <del>${price.toFixed(2)}</del>
                </SemiSpan>
              )}
            </FlexBox>
          </Box>

          <FlexBox
            flexDirection="column-reverse"
            alignItems="center"
            justifyContent={cartAmount ? "space-between" : "flex-start"}
            width="30px"
          >
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="small"
              borderColor="primary.light"
              onClick={() => handleCartAmountChange(cartAmount + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>

            {cartAmount > 0 && (
              <Fragment>
                <SemiSpan color="text.primary" fontWeight="600">
                  {cartAmount}
                </SemiSpan>
                <Button
                  variant="outlined"
                  color="primary"
                  padding="5px"
                  size="small"
                  borderColor="primary.light"
                  onClick={() => handleCartAmountChange(cartAmount - 1)}
                >
                  <Icon variant="small">minus</Icon>
                </Button>
              </Fragment>
            )}
          </FlexBox>
        </FlexBox>
      </div>

      <Modal open={open} onClose={toggleDialog}>
        <Card p="1rem" position="relative">
          <ProductIntro
            product={{
              id: title, // Assuming title acts as id
              images: [imgUrl], // Pass imgUrl as an array
              title,
              price,
              brand: undefined,
              stock: undefined,
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
