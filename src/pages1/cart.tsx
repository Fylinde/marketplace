import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/reduxHooks";
import FlexBox from "../components/FlexBox";
import Grid from "../components/grid/Grid";
import Typography from "../components/Typography";
import Divider from "../components/Divider";
import Button from "../components/buttons/Button";
import Select from "../components/Select";
import TextField from "../components/text-field/TextField";
import TextArea from "../components/textarea/TextArea";
import LinearProgress from "../components/progressbar/LinearProgress";
import { Card1 } from "../components/Card1";
import ProductCard7 from "../components/product-cards/ProductCard7";
import { changeCartAmount, removeItem, applyDiscount } from "../redux/slices/orders/cartSlice";
import { formatCurrency, getLocalizedText } from "../utils/localizationUtils";
import shippingCalculator from "../utils/shippingCalculator"; // Import shipping calculator

const Cart = () => {
  const dispatch = useAppDispatch();

  // Redux State with fallback for currency
  const {
    cartList,
    totalBuyerPrice,
    discount,
    freeShippingThreshold,
    currency: currencyState,
  } = useAppSelector((state) => state.cart);

  const currency = currencyState || "USD"; // Fallback to "USD" if currency is undefined

  const [paymentMethod, setPaymentMethod] = useState<string>("fiat"); // Default to fiat
  const [paymentFees, setPaymentFees] = useState<number>(0); // Fee for selected method
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalCostWithShipping, setTotalCostWithShipping] = useState<number>(0);
  const [voucher, setVoucher] = useState<string>("");

  // Calculate Free Shipping Progress
  const freeShippingProgress = freeShippingThreshold
    ? Math.min((totalBuyerPrice / freeShippingThreshold) * 100, 100)
    : 0;
  const remainingForFreeShipping = freeShippingThreshold
    ? Math.max(freeShippingThreshold - totalBuyerPrice, 0)
    : 0;

  // Calculate Payment Fees
  const calculatePaymentFees = (method: string) => {
    switch (method) {
      case "crypto":
        return totalBuyerPrice * 0.02; // Example: 2% fee for crypto
      case "escrow":
        return totalBuyerPrice * 0.03; // Example: 3% escrow fee
      default:
        return 0; // No additional fee for fiat
    }
  };

  // Handle Payment Method Change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    const fees = calculatePaymentFees(method);
    setPaymentFees(fees);
    setTotalCostWithShipping(totalBuyerPrice + fees + shippingCost - discount);
  };

  // Calculate and Set Shipping Cost
  const calculateShippingCost = async () => {
    try {
      const result = await shippingCalculator.calculateShipping({
        methodId: "standard",
        address: {
          country: "US", // Example country
          state: "NY", // Example state
          city: "New York", // Add city property
          postalCode: "10001", // Example postal code
        },
        cartTotal: totalBuyerPrice,
      });
  
      setShippingCost(result.shippingCost); // Update shipping cost
      setTotalCostWithShipping(totalBuyerPrice + paymentFees + result.shippingCost - discount);
    } catch (error) {
      console.error("Error calculating shipping cost:", error);
    }
  };
  

  useEffect(() => {
    calculateShippingCost();
  }, [totalBuyerPrice]);

  // Handle Voucher Application
  const applyVoucher = () => {
    const discountValue = voucher === "SAVE10" ? 10 : 0; // Example validation logic
    dispatch(applyDiscount({ discount: discountValue }));
  };

  return (
    <Fragment>
      <Grid container spacing={6}>
        {/* Cart Items Section */}
        <Grid item lg={8} md={8} xs={12}>
          {cartList.length > 0 ? (
            cartList.map((item) => (
              <ProductCard7
                key={item.id}
                mb="1.5rem"
                {...item}
                removeItem={() => dispatch(removeItem(item.id))}
                updateQuantity={(quantity: number) =>
                  dispatch(changeCartAmount({ id: item.id, amount: quantity }))
                }
              />
            ))
          ) : (
            <Typography>{getLocalizedText("cartEmpty", "shipping")}</Typography>
          )}
        </Grid>

        {/* Cart Summary Section */}
        <Grid item lg={4} md={4} xs={12}>
          <Card1>
            {/* Free Shipping Progress */}
            {freeShippingThreshold && (
              <div className="free-shipping">
                <LinearProgress
                  value={freeShippingProgress}
                  label={
                    remainingForFreeShipping > 0
                      ? getLocalizedText("freeShippingProgress", "shipping", {
                          amount: formatCurrency(remainingForFreeShipping, currency),
                        })
                      : getLocalizedText("freeShippingAchieved", "shipping")
                  }
                  color="primary"
                  thickness={8}
                />
              </div>
            )}

            <Divider mb="1rem" />

            {/* Payment Method Selector */}
            <Typography fontWeight="600" mb="1rem">
              {getLocalizedText("selectPaymentMethod", "shipping")}
            </Typography>
            <Select
              value={{ label: paymentMethod, value: paymentMethod }}
              options={[
                { label: getLocalizedText("fiat", "shipping"), value: "fiat" },
                { label: getLocalizedText("crypto", "shipping"), value: "crypto" },
                { label: getLocalizedText("escrow", "shipping"), value: "escrow" },
              ]}
              onChange={(option) =>
                handlePaymentMethodChange((option as { value: string }).value)
              }
              mb="1rem"
            />

            {/* Price Breakdown */}
            <Typography fontWeight="600" mb="1rem">
              {getLocalizedText("priceSummary", "shipping")}
            </Typography>
            <FlexBox justifyContent="space-between" mb="1rem">
              <Typography>{getLocalizedText("subtotal", "shipping")}:</Typography>
              <Typography>{formatCurrency(totalBuyerPrice, currency)}</Typography>
            </FlexBox>
            <FlexBox justifyContent="space-between" mb="1rem">
              <Typography>{getLocalizedText("paymentFees", "shipping")}:</Typography>
              <Typography>{formatCurrency(paymentFees, currency)}</Typography>
            </FlexBox>
            <FlexBox justifyContent="space-between" mb="1rem">
              <Typography>{getLocalizedText("shipping", "shipping")}:</Typography>
              <Typography>{formatCurrency(shippingCost, currency)}</Typography>
            </FlexBox>
            <Divider mb="1rem" />
            <FlexBox justifyContent="space-between" mb="1rem">
              <Typography fontWeight="600">{getLocalizedText("total", "shipping")}:</Typography>
              <Typography fontWeight="600">
                {formatCurrency(totalCostWithShipping || totalBuyerPrice, currency)}
              </Typography>
            </FlexBox>

            {/* Voucher Application */}
            <TextField
              placeholder={getLocalizedText("voucherPlaceholder", "shipping")}
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              fullwidth
              mb="1rem"
            />
            <Button variant="outlined" color="primary" onClick={applyVoucher} fullwidth>
              {getLocalizedText("applyVoucher", "shipping")}
            </Button>

            <Divider my="1.5rem" />

            {/* Actions */}
            <Link to="/checkout">
              <Button variant="contained" color="primary" fullwidth>
                {getLocalizedText("checkoutNow", "shipping")}
              </Button>
            </Link>
          </Card1>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Cart;
