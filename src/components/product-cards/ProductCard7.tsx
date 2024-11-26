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

export interface ProductCard7Props {
  id: string | number;
  name: string;
  qty: number;
  price: number;
  imgUrl?: string;
}

const ProductCard7: React.FC<ProductCard7Props & SpaceProps> = ({
  id,
  name,
  qty,
  price,
  imgUrl = "/assets/images/products/iphone-xi.png", // Default image
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
      <Image
        src={imgUrl}
        size={140}
        display="block"
        alt={name}
      />
      <FlexBox
        className="product-details"
        flexDirection="column"
        justifyContent="space-between"
        minWidth="0px"
        width="100%"
      >
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
        <Box position="absolute" right="1rem" top="1rem">
          <IconButton
            padding="4px"
            ml="12px"
            onClick={() => handleCartAmountChange(0)} // Remove product
          >
            <Icon size="1.25rem">close</Icon>
          </IconButton>
        </Box>

        <FlexBox justifyContent="space-between" alignItems="flex-end">
          <FlexBox flexWrap="wrap" alignItems="center">
            <Typography color="gray.600" mr="0.5rem">
              ${price.toFixed(2)} x {qty}
            </Typography>
            <Typography fontWeight={600} color="primary.main" mr="1rem">
              ${(price * qty).toFixed(2)}
            </Typography>
          </FlexBox>

          <FlexBox alignItems="center">
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="small"
              borderColor="primary.light"
              onClick={() => handleCartAmountChange(qty - 1)}
              disabled={qty === 1}
            >
              <Icon variant="small">minus</Icon>
            </Button>
            <Typography mx="0.5rem" fontWeight="600" fontSize="15px">
              {qty}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="small"
              borderColor="primary.light"
              onClick={() => handleCartAmountChange(qty + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </StyledProductCard7>
  );
};

export default ProductCard7;
