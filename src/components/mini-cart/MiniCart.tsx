import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/reduxHooks";
import FlexBox from "../FlexBox";
import LinearProgress from "../progressbar/LinearProgress";
import Button from "../buttons/Button";
import Icon from "../icon/Icon";
import Typography, { Paragraph } from "../Typography";
import { StyledMiniCart, StyledCartItem } from "./MiniCartStyle";
import { removeItemFromCart, changeCartAmount } from "../../redux/slices/orders/cartSlice";
import { formatCurrency } from "../../utils/localizationUtils";


export type MiniCartProps = {
  toggleSidenav: () => void;
  currentStep: number;
};
const MiniCart: React.FC<MiniCartProps> = ({ toggleSidenav, currentStep }) => {
  const dispatch = useAppDispatch();

  // Redux State
  const { cartList, currency } = useAppSelector((state) => state.cart);

  // Calculate subtotal
  const subtotal = cartList.reduce(
    (acc, item) => acc + item.buyerPrice * item.quantity,
    0
  );

  // Free shipping progress (example threshold: $50)
  const freeShippingThreshold = 50;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleRemoveItem = (id: string) => dispatch(removeItemFromCart(id));
  const handleChangeQuantity = (id: string, quantity: number) =>
    dispatch(changeCartAmount({ id, amount: quantity }));

  return (
    <StyledMiniCart>
      {/* Free Shipping Progress */}
      <div className="free-shipping">
        <LinearProgress
          value={freeShippingProgress}
          label={
            remainingForFreeShipping > 0
              ? `You're ${formatCurrency(remainingForFreeShipping, currency)} away from free shipping!`
              : "Congratulations! You’ve earned free shipping!"
          }
          color="primary"
          thickness={8}
        />
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cartList.length === 0 ? (
          <FlexBox justifyContent="center" alignItems="center" height="100%">
            <Paragraph>Your cart is empty!</Paragraph>
          </FlexBox>
        ) : (
          cartList.map((item) => (
            <StyledCartItem key={item.id}>
              <img src={item.imgUrl || "/assets/default-product.jpg"} alt={item.name} />
              <div className="item-details">
                <Typography>{item.name}</Typography>
                <FlexBox alignItems="center" justifyContent="space-between" mt="0.5rem">
                  <div className="quantity-controls">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleChangeQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="quantity">{item.quantity}</span>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleChangeQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Typography>
                    {formatCurrency(item.buyerPrice * item.quantity, currency)}
                  </Typography>
                </FlexBox>
              </div>
              <Icon
                color="error"
                size="small"
                onClick={() => handleRemoveItem(item.id)}
                style={{ cursor: "pointer" }}
              >
                delete
              </Icon>
            </StyledCartItem>
          ))
        )}
      </div>

      {/* Subtotal */}
      <div className="cart-summary">
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography fontWeight="600">Subtotal:</Typography>
          <Typography fontWeight="600">{formatCurrency(subtotal, currency)}</Typography>
        </FlexBox>
      </div>

      {/* Actions */}
      {cartList.length > 0 && (
        <FlexBox justifyContent="space-between" mt="1rem">
          <Link to="/cart">
            <Button variant="outlined" color="primary" fullwidth>
              View Full Cart
            </Button>
          </Link>
          <Link to="/checkout">
            <Button variant="contained" color="primary" fullwidth>
              Checkout
            </Button>
          </Link>
        </FlexBox>
      )}
    </StyledMiniCart>
  );
};

export default MiniCart;
