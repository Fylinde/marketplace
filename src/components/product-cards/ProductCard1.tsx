import React, { Fragment, useCallback, useState } from 'react';
import LazyImage from 'components/LazyImage';
import { useAppContext } from 'contexts/app/AppContext';
import { CartItem } from 'reducers/cartReducer';
import { Link } from "react-router-dom";
import { CSSProperties } from 'styled-components';
import Box from '../Box';
import Button from '../buttons/Button';
import Card, { CardProps } from '../Card';
import { Chip } from '../Chip';
import FlexBox from '../FlexBox';
import Icon from '../icon/Icon';
import Modal from '../modal/Modal';
import ProductIntro from '../products/ProductIntro';
import Rating from '../rating/Rating';
import { H3, SemiSpan } from '../Typography';
import { StyledProductCard1 } from './ProductCardStyle';

export interface ProductCard1Props extends CardProps {
  className?: string;
  style?: CSSProperties;
  imgUrl?: string;
  title?: string;
  price?: number;
  off?: number;
  rating?: number;
  id?: string | number;
  category?: string;
  images?: string[];
  brand?: string;
  stock?: boolean; // Add stock as an optional prop
}

const ProductCard1: React.FC<ProductCard1Props> = ({
  id,
  imgUrl = '/assets/images/default-product.png', // Default image
  title = 'No Title Available', // Default title
  price = 0, // Default price
  off,
  rating = 0, // Default rating
  category,
  images,
  brand,
  stock, // Include stock in the props destructuring
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const { state, dispatch } = useAppContext();
  const cartItem: CartItem | undefined = state.cart.cartList.find((item: CartItem) => item.id === id);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const handleCartAmountChange = useCallback(
    (amount: number) => () => {
      dispatch({
        type: 'CHANGE_CART_AMOUNT',
        payload: {
          name: title,
          qty: amount,
          price,
          imgUrl,
          id,
        },
      });
    },
    [dispatch, title, price, imgUrl, id]
  );

  return (
    <StyledProductCard1 {...props}>
      <div className="image-holder">
        {!!off && (
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
          <Icon
            color="secondary"
            variant="small"
            mb="0.5rem"
            onClick={toggleDialog}
          >
            eye-alt
          </Icon>

          <Icon className="favorite-icon outlined-icon" variant="small">
            heart
          </Icon>
        </FlexBox>

        <Link to={`/product/${id}`}>
          <LazyImage
            src={images && images.length > 0 ? images[0] : imgUrl} // Use first image if available, else fallback
            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
            alt={title}
          />
        </Link>
      </div>

      <div className="details">
        <FlexBox>
          <Box flex="1 1 0" minWidth="0px" mr="0.5rem">
            <Link to={`/product/${id}`}>
              <H3
                className="title"
                fontSize="14px"
                textAlign="left"
                fontWeight="600"
                color="text.secondary"
                mb="10px"
                title={title}
              >
                {title}
              </H3>
            </Link>

            {/* Display brand if available */}
            {brand && (
              <SemiSpan color="text.muted" fontSize="12px" mb="5px">
                Brand: {brand}
              </SemiSpan>
            )}

            {/* Display category if available */}
            {category && (
              <SemiSpan color="text.muted" fontSize="12px" mb="5px">
                Category: {category}
              </SemiSpan>
            )}

            {/* Display stock status */}
            <SemiSpan
              color={stock ? "success.main" : "error.main"}
              fontSize="12px"
              mb="5px"
            >
              {stock ? "In Stock" : "Out of Stock"}
            </SemiSpan>

            <Rating value={rating} outof={5} color="warn" readonly />

            <FlexBox alignItems="center" mt="10px">
              <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                ${(price - (price * (off ?? 0)) / 100).toFixed(2)}
              </SemiSpan>

              {!!off && (
                <SemiSpan color="text.muted" fontWeight="600">
                  <del>{price.toFixed(2)}</del>
                </SemiSpan>
              )}
            </FlexBox>
          </Box>

          <FlexBox
            flexDirection="column-reverse"
            alignItems="center"
            justifyContent={!!cartItem?.qty ? 'space-between' : 'flex-start'}
            width="30px"
          >
            <Button
              variant="outlined"
              color="primary"
              padding="3px"
              size="none"
              borderColor="primary.light"
              onClick={handleCartAmountChange((cartItem?.qty || 0) + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>

            {!!cartItem?.qty && (
              <Fragment>
                <SemiSpan color="text.primary" fontWeight="600">
                  {cartItem?.qty}
                </SemiSpan>
                <Button
                  variant="outlined"
                  color="primary"
                  padding="3px"
                  size="none"
                  borderColor="primary.light"
                  onClick={handleCartAmountChange(cartItem?.qty - 1)}
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
            imgUrl={images && images.length > 0 ? images : [imgUrl]} // Use images if available, else fallback
            title={title}
            price={price}
            id={id}
            brand={brand} // Pass brand to ProductIntro if needed
            stock={stock} // Pass stock to ProductIntro if needed
          />
          <Box
            position="absolute"
            top="0.75rem"
            right="0.75rem"
            cursor="pointer"
          >
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
    </StyledProductCard1>
  );
};

export default ProductCard1;
