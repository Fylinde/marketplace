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
import { H5, SemiSpan } from "../Typography";
import { StyledProductCard9 } from "./ProductCardStyle";

export interface ProductCard9Props {
  className?: string;
  style?: CSSProperties;
  imgUrl?: string;
  title?: string;
  price?: number;
  off?: number;
  rating?: number;
  subcategories?: Array<{ title: string; url: string }>;
  [key: string]: unknown;
}

const ProductCard9: React.FC<ProductCard9Props> = ({
  imgUrl = "/assets/images/default.png", // Default fallback image
  title = "No Title Available", // Default fallback title
  price = 0, // Default fallback price
  off,
  subcategories,
  rating = 0, // Default fallback rating
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

        <Grid item md={8} sm={8} xs={12}>
          <FlexBox flexDirection="column" justifyContent="center" height="100%" p="1rem">
            {subcategories?.map((item) => (
              <NavLink key={item.title} className="link" to={item.url}>
                {item.title}
              </NavLink>
            ))}

            <Link to={`/product/${title}`}>
              <H5 fontWeight="600" my="0.5rem">
                {title}
              </H5>
            </Link>

            <Rating value={rating} outof={5} color="warn" readonly />

            <FlexBox mt="0.5rem" mb="1rem" alignItems="center">
              <H5 fontWeight={600} color="primary.main" mr="0.5rem">
                ${discountedPrice}
              </H5>
              {off && (
                <SemiSpan fontWeight="600">
                  <del>${price.toFixed(2)}</del>
                </SemiSpan>
              )}
            </FlexBox>

            <Hidden up="sm">
              <FlexBox alignItems="center" justifyContent="space-between" flexDirection="row-reverse" height="30px">
                <Icon className="favorite-icon outlined-icon" variant="small">
                  heart
                </Icon>

                <FlexBox alignItems="center" flexDirection="row-reverse">
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
                  {!!cartAmount && (
                    <Fragment>
                      <H5 fontWeight="600" fontSize="15px" mx="0.75rem">
                        {cartAmount}
                      </H5>
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
            </Hidden>
          </FlexBox>
        </Grid>
      </Grid>

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
