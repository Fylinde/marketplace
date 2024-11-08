import Avatar from "components/avatar/Avatar";
import FlexBox from "components/FlexBox";
import LazyImage from "components/LazyImage";
import { useAppContext } from "contexts/app/AppContext";
import { CartItem } from "reducers/cartReducer";
import { Link } from "react-router-dom";
import React, { Fragment, useCallback } from "react";
import Button from "../buttons/Button";
import Divider from "../Divider";
import Icon from "../icon/Icon";
import Typography, { H5, Paragraph, Tiny } from "../Typography";
import { StyledMiniCart } from "./MiniCartStyle";

type MiniCartProps = {
  toggleSidenav?: () => void;
};

const MiniCart: React.FC<MiniCartProps> = ({ toggleSidenav }) => {
  const { state, dispatch } = useAppContext();
  const { cartList } = state.cart;

  const handleCartAmountChange = useCallback(
    (amount: number, product: CartItem) => () => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: {
          ...product,
          qty: amount,
        },
      });
    },
    [dispatch]
  );

  const getTotalPrice = (): number => {
    return (
      cartList.reduce(
        (accumulator: number, item: CartItem) =>
          accumulator + item.price * item.qty,
        0
      ) || 0
    );
  };

  return (
    <StyledMiniCart>
      <div className="cart-list">
        <FlexBox alignItems="center" m="0px 20px" height="74px">
          <Icon size="1.75rem">bag</Icon>
          <Typography fontWeight={600} fontSize="16px" ml="0.5rem">
            {cartList.length} item
          </Typography>
        </FlexBox>

        <Divider />

        {!!!cartList.length && (
          <FlexBox
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="calc(100% - 80px)"
          >
            <LazyImage
              src="/assets/images/logos/shopping-bag.svg"
              style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              alt="Shopping bag" // Add alt text for accessibility
            />
            <Paragraph
              mt="1rem"
              color="text.muted"
              textAlign="center"
              maxWidth="200px"
            >
              Your shopping bag is empty. Start shopping
            </Paragraph>
          </FlexBox>
        )}
        {cartList.map((item: CartItem) => (
          <Fragment key={item.id}>
            <div className="cart-item">
              <FlexBox alignItems="center" flexDirection="column">
                <Button
                  variant="outlined"
                  color="primary"
                  padding="5px"
                  size="none"
                  borderColor="primary.light"
                  borderRadius="300px"
                  onClick={handleCartAmountChange(item.qty + 1, item)}
                >
                  <Icon variant="small">plus</Icon>
                </Button>
                <Typography fontWeight={600} fontSize="15px" my="3px">
                  {item.qty}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  padding="5px"
                  size="none"
                  borderColor="primary.light"
                  borderRadius="300px"
                  onClick={handleCartAmountChange(item.qty - 1, item)}
                  disabled={item.qty === 1}
                >
                  <Icon variant="small">minus</Icon>
                </Button>
              </FlexBox>

              {/* Removed unnecessary <a> tag */}
              <Link to={`/product/${item.id}`}>
                <Avatar
                  src={item.imgUrl || "/assets/images/products/iphone-x.png"}
                  mx="1rem"
                  alt={item.name}
                  size={76}
                />
              </Link>

              <div className="product-details">
                {/* Removed unnecessary <a> tag */}
                <Link to={`/product/${item.id}`}>
                  <H5 className="title" fontSize="14px">
                    {item.name}
                  </H5>
                </Link>
                <Tiny color="text.muted">
                  ${item.price.toFixed(2)} x {item.qty}
                </Tiny>
                <Typography
                  fontWeight={600}
                  fontSize="14px"
                  color="primary.main"
                  mt="4px"
                >
                  ${(item.qty * item.price).toFixed(2)}
                </Typography>
              </div>

              <Icon
                className="clear-icon"
                size="1rem"
                ml="1.25rem"
                onClick={handleCartAmountChange(0, item)}
              >
                close
              </Icon>
            </div>
            <Divider />
          </Fragment>
        ))}
      </div>

      {!!cartList.length && (
        <Fragment>
          <Link to="/checkout">
            <Button
              variant="contained"
              color="primary"
              m="1rem 1rem 0.75rem"
              onClick={toggleSidenav}
            >
              <Typography fontWeight={600}>
                Checkout Now (${getTotalPrice().toFixed(2)})
              </Typography>
            </Button>
          </Link>
          <Link to="/cart">
            <Button
              color="primary"
              variant="outlined"
              m="0px 1rem 0.75rem"
              onClick={toggleSidenav}
            >
              <Typography fontWeight={600}>View Cart</Typography>
            </Button>
          </Link>
        </Fragment>
      )}
    </StyledMiniCart>
  );
};

MiniCart.defaultProps = {
  toggleSidenav: () => {},
};

export default MiniCart;
