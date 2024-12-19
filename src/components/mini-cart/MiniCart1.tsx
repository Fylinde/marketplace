import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartItem } from "../../types/cartItem";
import FlexBox from "../../components/FlexBox";
import LinearProgress from "../progressbar/LinearProgress";
import Button from "../../components/buttons/Button";
import Divider from "../../components/Divider";
import Icon from "../../components/icon/Icon";
import Typography, { Paragraph } from "../../components/Typography";
import { StyledMiniCart } from "./MiniCartStyle";
import { useAppSelector, useAppDispatch } from "../../redux/reduxHooks";
import {
  removeItemFromCart,
  fetchRecommendations,
  changeCartAmount,
  lockExchangeRate,
} from "../../redux/slices/orders/cartSlice";
import { fetchShippingMethods, setSelectedMethod } from "../../redux/slices/logistics/shippingSlice";
import { fetchCurrentExchangeRates } from "../../redux/slices/utils/exchangeRateSlice";
import shippingCalculator from "../../utils/shippingCalculator";
import priceCalculation from "../../utils/priceCalculations";
import { getLocalizedText, formatCurrency } from "../../utils/localizationUtils";

type MiniCartProps = {
  toggleSidenav?: () => void; // Used to close the cart sidebar
  currentStep: number;
};

const steps = ["Cart", "Shipping", "Payment", "Confirmation"];

const MiniCart: React.FC<MiniCartProps> = ({ toggleSidenav, currentStep }) => {
  const dispatch = useAppDispatch();

  // Redux State
  const { cartList, currency, lockedExchangeRate, recommendations } = useAppSelector(
    (state) => state.cart
  );
  const { methods: shippingMethods, selectedMethod } = useAppSelector((state) => state.shipping);
  const { currentRates, loading: rateLoading, error: rateError } = useAppSelector(
    (state) => state.exchangeRate
  );

  // Local State
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalWithShipping, setTotalWithShipping] = useState<number>(0);

  // Fetch Recommendations, Shipping Methods, and Exchange Rates on Load
  useEffect(() => {
    dispatch(fetchRecommendations());
    dispatch(fetchShippingMethods({ country: "USA", currency: "USD" }));
    if (!currentRates) {
      dispatch(fetchCurrentExchangeRates());
    }
  }, [dispatch, currentRates]);

  // Lock Exchange Rates During Checkout
  const handleCheckout = () => {
    if (!lockedExchangeRate && currentRates) {
      dispatch(lockExchangeRate(currentRates.rates)); // Lock rates for cart
    }
    if (toggleSidenav) toggleSidenav();
  };

  // Calculate totals using priceCalculation utility
// Calculate totals using priceCalculation utility
const {
  totalBuyerPrice,
  totalSellerPrice,
  totalTax,
  totalDiscount,
  totalWithShipping: calculatedTotal,
} = priceCalculation.calculate({
  items: cartList.map((item) => ({
    sellerPrice: item.sellerPrice,
    quantity: item.quantity,
    discount: item.discount,
    taxRate: item.taxRate,
    // Change lockedExchangeRate from null to undefined if null
    lockedExchangeRate: lockedExchangeRate ? lockedExchangeRate[currency] : undefined,
  })),
  shippingCost,
});


  useEffect(() => {
    setTotalWithShipping(calculatedTotal);
  }, [calculatedTotal]);

  // Simulate progress towards free shipping
  const freeShippingThreshold = 50;
  const freeShippingProgress = Math.min((totalBuyerPrice / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - totalBuyerPrice, 0);

  // Handle Shipping Selection
  const handleShippingSelection = async (methodId: string) => {
    try {
      const result = await shippingCalculator.calculateShipping({
        methodId,
        address: { country: "USA", state: "CA", city: "San Francisco", postalCode: "94103" },
        cartTotal: totalBuyerPrice,
      });
      setShippingCost(result.shippingCost);
      dispatch(setSelectedMethod(methodId));
    } catch (error) {
      console.error("Error calculating shipping:", error);
    }
  };

  // Handle Cart Actions
  const handleRemoveItem = (id: string) => dispatch(removeItemFromCart(id));
  const handleChangeQuantity = (id: string, quantity: number) =>
    dispatch(changeCartAmount({ id, amount: quantity }));

  return (
    <StyledMiniCart>
      {/* Steps Indicator */}
      <div className="progress-indicator">
        <Typography fontWeight={600} fontSize="14px">
          {steps.map((step, index) => (
            <Fragment key={index}>
              <span style={{ color: index <= currentStep ? "blue" : "gray" }}>
                {getLocalizedText(step.toLowerCase(), "shipping")}
              </span>
              {index < steps.length - 1 && <Icon mx="0.5rem">arrow_forward</Icon>}
            </Fragment>
          ))}
        </Typography>
      </div>
      <Divider />

      {/* Loading and Error States for Exchange Rates */}
      {rateLoading && <Typography>Loading exchange rates...</Typography>}
      {rateError && <Typography color="error">Error loading exchange rates: {rateError}</Typography>}

      {/* Free Shipping Progress */}
      <LinearProgress
        value={freeShippingProgress}
        label={
          remainingForFreeShipping > 0
            ? getLocalizedText("freeShippingLabel", "shipping", {
                amount: formatCurrency(remainingForFreeShipping, currency),
              })
            : getLocalizedText("freeShippingAchieved", "shipping")
        }
        color="primary"
        thickness={8}
      />

      {/* Cart Items */}
      <div className="cart-list">
        {cartList.length === 0 ? (
          <FlexBox alignItems="center" justifyContent="center" height="100%">
            <Paragraph>{getLocalizedText("emptyCart", "shipping")}</Paragraph>
          </FlexBox>
        ) : (
          cartList.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              <FlexBox alignItems="center" justifyContent="space-between">
                <Typography fontWeight={600}>{item.name}</Typography>
                <div>
                  <Button size="small" onClick={() => handleChangeQuantity(item.id, item.quantity - 1)}>
                    -
                  </Button>
                  <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                  <Button size="small" onClick={() => handleChangeQuantity(item.id, item.quantity + 1)}>
                    +
                  </Button>
                </div>
                <Typography>{formatCurrency(item.buyerPrice * item.quantity, currency)}</Typography>
              </FlexBox>
              <Button variant="text" color="error" onClick={() => handleRemoveItem(item.id)}>
                {getLocalizedText("remove", "shipping")}
              </Button>
              <Divider />
            </div>
          ))
        )}
      </div>

      {/* Shipping Methods */}
      <Typography fontWeight={600} mt="1rem">
        {getLocalizedText("selectShipping", "shipping")}
      </Typography>
      {shippingMethods.map((method) => (
        <FlexBox
          key={method.id}
          onClick={() => handleShippingSelection(method.id)}
          style={{
            cursor: "pointer",
            padding: "10px",
            border: `2px solid ${selectedMethod === method.id ? "blue" : "lightgray"}`,
            marginBottom: "0.5rem",
          }}
        >
          <Typography>{`${method.name} - ${formatCurrency(method.rate, currency)} (${
            method.estimatedDelivery
          })`}</Typography>
        </FlexBox>
      ))}

      {/* Price Summary */}
      <div>
        <Typography>Subtotal: {formatCurrency(totalBuyerPrice, currency)}</Typography>
        <Typography>Seller Revenue: {formatCurrency(totalSellerPrice, "USD")}</Typography>
        <Typography>Discount: -{formatCurrency(totalDiscount, currency)}</Typography>
        <Typography>Taxes: {formatCurrency(totalTax, currency)}</Typography>
        <Typography>Shipping: {formatCurrency(shippingCost, currency)}</Typography>
        <Divider />
        <Typography fontWeight={600}>Total: {formatCurrency(totalWithShipping, currency)}</Typography>
      </div>

      {/* Checkout Actions */}
      {cartList.length > 0 && (
        <>
          <Link to="/checkout">
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              {getLocalizedText("checkoutNow", "shipping")}
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="outlined">{getLocalizedText("viewCart", "shipping")}</Button>
          </Link>
        </>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <>
          <Divider />
          <Typography fontWeight={600} mt="1rem">
            {getLocalizedText("recommendedForYou", "shipping")}
          </Typography>
          {recommendations.map((item) => (
            <div key={item.id}>
              <Typography>
                {item.name} - {formatCurrency(item.buyerPrice, currency)}
              </Typography>
            </div>
          ))}
        </>
      )}
    </StyledMiniCart>
  );
};

export default MiniCart;
