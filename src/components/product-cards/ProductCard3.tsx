import React, { useCallback } from "react";
import { CSSProperties } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { changeCartAmount } from "../../redux/slices/cartSlice"; // Ensure this is correctly imported
import { RootState } from "../../redux/store"; // Adjust import path based on your project structure
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { StyledProductCard3 } from "./ProductCardStyle";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface CartItem {
  id: string | number;
  quantity: number;
}

export interface ProductCard3Props {
  className?: string;
  style?: CSSProperties;
  id: string | number; // Made `id` required for unique identification
  title?: string;
  imgUrl?: string;
  price?: number;
  discount?: number;
  rating?: number;
}

const ProductCard3: React.FC<ProductCard3Props> = React.memo(({
  id,
  title = "No Title Available", // Default title
  imgUrl = "/assets/images/default-product.png", // Default image
  price = 0, // Default price
  discount = 0, // Default discount
  rating = 0, // Default rating
  ...props
}) => {
  const dispatch = useDispatch();

  // Select the cart item based on its `id`
  const cartItem = useSelector((state: RootState) =>
    state.cart.cartList.find((item: CartItem) => item.id === id)
  );

  // Handle cart quantity changes
  const handleCartAmountChange = useCallback(
    (amount: number) => {
      if (amount >= 0) {
        dispatch(
          changeCartAmount({
            id: String(id),
            amount,
          })
        );
        // Log user interaction for analytics (example)
        console.log(`Cart updated: Product ID ${id}, Quantity: ${amount}`);
      }
    },
    [dispatch, id]
  );

  // Calculate the discounted price
  const discountedPrice = price - (price * discount) / 100;

  return (
    <StyledProductCard3 {...props}>
      <div className="image-holder">
        {discount > 0 && (
          <div className="sale-chip">{discount}% off</div>
        )}
        <LazyLoadImage
          src={imgUrl}
          alt={title}
          effect="blur"
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
        />
      </div>
      <div className="details">
        <FlexBox justifyContent="space-between" alignItems="center">
          <div>
            <h4>{title}</h4>
          </div>
          <div className="icon-holder">
            <Icon className="favorite-icon" color="primary" variant="small">
              heart-filled
            </Icon>
          </div>
        </FlexBox>
        <FlexBox justifyContent="space-between" alignItems="center">
          <div>
            <Rating value={rating} outof={5} color="warn" readonly />
            <div className="price">
              <h4>${discountedPrice.toFixed(2)}</h4>
              {discount > 0 && (
                <del>${price.toFixed(2)}</del>
              )}
            </div>
          </div>
          <div className="add-cart">
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="small"
              onClick={() => handleCartAmountChange((cartItem?.quantity || 0) - 1)}
            >
              <Icon variant="small">minus</Icon>
            </Button>
            <span style={{ margin: "0 8px" }}>{cartItem?.quantity || 0}</span>
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="small"
              onClick={() => handleCartAmountChange((cartItem?.quantity || 0) + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>
          </div>
        </FlexBox>
      </div>
    </StyledProductCard3>
  );
});

export default ProductCard3;
