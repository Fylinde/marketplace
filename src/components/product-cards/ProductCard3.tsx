import React, { useCallback } from "react";
import { CSSProperties } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { changeCartAmount } from "../../redux/slices/orders/cartSlice"; // Correct import
import { RootState } from "../../redux/store"; // Adjust import path based on your project structure
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { StyledProductCard3 } from "./ProductCardStyle";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


interface CartItem {
  id: string | number;
  quantity: number;
}

export interface ProductCard3Props {
  className?: string;
  style?: CSSProperties;
  id: string | number; // Required for unique identification
  title?: string;
  imgUrl?: string;
  price?: number;
  discount?: number;
  rating?: number;
  stock?: number; // Product stock
  sellerPrice?: number;
  buyerPrice?: number;
  sellerCurrency?: string;
  buyerCurrency?: string;
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  tryOnAvailable?: boolean; // TryOn availability
  isArEnabled?: boolean;
  onChatWithSeller?: (productId: string | number) => void; // Chat handler
  onTryNow?: (productId: string | number) => void; // TryOn handler
}

const ProductCard3: React.FC<ProductCard3Props> = React.memo(({
  id,
  title = "No Title Available", // Default title
  imgUrl = "/assets/images/default-product.png", // Default image
  price = 0, // Default price
  discount = 0, // Default discount
  rating = 0, // Default rating
  stock = 0, // Default stock
  sellerPrice = 0, // Seller price
  buyerPrice = 0, // Buyer price
  sellerCurrency = "USD", // Default seller currency
  buyerCurrency = "USD", // Default buyer currency
  reviews = [], // Localized reviews
  tryOnAvailable = false, // TryOn availability
  isArEnabled = false,
  onChatWithSeller,
  onTryNow,
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
            id: String(id), // Ensure id is passed as a string
            amount,
          })
        );
        console.log(`Cart updated: Product ID ${id}, Quantity: ${amount}`);
      }
    },
    [dispatch, id] // Include `id` in dependencies
  );


  const discountedPrice = price - (price * discount) / 100;

  return (
    <StyledProductCard3 {...props}>
      <div className="image-holder">
        {discount > 0 && <div className="sale-chip">{discount}% off</div>}
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
              <h4>
                {buyerCurrency} {buyerPrice.toFixed(2)}
              </h4>
              {sellerCurrency && (
                <p style={{ fontSize: "12px", color: "gray" }}>
                  ({sellerCurrency} {sellerPrice.toFixed(2)})
                </p>
              )}
              {discount > 0 && <del>${price.toFixed(2)}</del>}
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

        <p style={{ color: stock > 0 ? "green" : "red" }}>
          {stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {onChatWithSeller && (
          <Button
            variant="contained"
            color="secondary"
            fullwidth
            style={{ marginTop: "10px" }}
            onClick={() => onChatWithSeller?.(id)}
          >
            Chat with Seller
          </Button>
        )}

        {tryOnAvailable && (
          <Button
            variant="contained"
            color="primary"
            fullwidth
            style={{ marginTop: "10px" }}
            onClick={() => onTryNow?.(id)}
          >
            Try Now
          </Button>
        )}

        {/* View in AR */}
        <ViewInSpaceButton productId={id} isArEnabled={isArEnabled} />


        {reviews.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <h4>Reviews:</h4>
            {reviews.map((review, index) => (
              <p key={index}>
                {review.user}: {review.comment} ({review.rating}/5)
              </p>
            ))}
          </div>
        )}
      </div>
    </StyledProductCard3>
  );
});

export default ProductCard3;
