import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List, Divider, Button, Alert } from "antd";
import { setCurrentStep } from "../../redux/slices/orders/checkoutSlice";
import { placeOrder } from "../../redux/slices/orders/orderSlice";
import priceCalculation from "../../utils/priceCalculations";
import shippingCalculator from "../../utils/shippingCalculator";
import taxService from "../../services/taxService";
import { getLocalizedText, formatCurrency } from "../../utils/localizationUtils";
import {
  OrderReviewCard,
  SectionTitle,
  AddressDetails,
  SummaryList,
  PriceDetails,
  ButtonContainer,
} from "./styles/OrderReview.styles";
import { AppDispatch, RootState } from "../../redux/store";
import { CartItem } from "../../types/cartItem";
import { ExchangeRate } from "../../types/ExchangeRate";

const OrderReview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    cartItems,
    shippingAddress,
    billingAddress,
    paymentMethod,
    discount,
    deliveryOption,
    buyerCurrency,
    sellerCurrency,
  } = useSelector((state: RootState) => state.checkout);

  const error = useSelector((state: RootState) => state.orders.error);
  const loading = useSelector((state: RootState) => state.orders.loading);

  const [totalBuyerPrice, setTotalBuyerPrice] = useState<number>(0);
  const [totalSellerPrice, setTotalSellerPrice] = useState<number>(0);
  const [totalShippingCost, setTotalShippingCost] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    calculateOrderSummary();
  }, [cartItems, deliveryOption, shippingAddress]);

  const calculateOrderSummary = async () => {
    try {
      const exchangeRate: ExchangeRate | null =
        cartItems[0]?.exchangeRate || null;

      if (!exchangeRate) {
        console.error("No valid exchange rate found");
        return;
      }

      const priceResult = priceCalculation.calculate({
        items: cartItems.map((item: CartItem) => ({
          buyerPrice: item.buyerPrice || 0,
          sellerPrice: item.sellerPrice || 0,
          quantity: item.quantity || 1,
          discount: item.discount || 0,
          taxRate: 0,
          lockedExchangeRate: item.lockedExchangeRate ?? undefined,
        })),
        shippingCost: totalShippingCost || 0,
        exchangeRate: exchangeRate,
        buyerCurrency: buyerCurrency || "USD",
        sellerCurrency: sellerCurrency || "USD",
      });

      setTotalBuyerPrice(priceResult.totalBuyerPrice);
      setTotalSellerPrice(priceResult.totalSellerPrice);

      if (deliveryOption && shippingAddress) {
        const shippingData = await shippingCalculator.calculateShipping({
          methodId: deliveryOption.id,
          address: shippingAddress,
          cartTotal: priceResult.totalBuyerPrice,
        });
        setTotalShippingCost(shippingData.shippingCost);
      }

      const taxData = await taxService.calculateTax({
        price: priceResult.totalBuyerPrice + totalShippingCost,
        country: shippingAddress?.country || "",
        region: shippingAddress?.state || "",
      });
      setTotalTax(taxData.taxAmount);

      const grandTotalPrice =
        priceResult.totalBuyerPrice +
        totalShippingCost +
        taxData.taxAmount -
        priceResult.totalDiscount;
      setGrandTotal(grandTotalPrice);
    } catch (error) {
      console.error("Error calculating order summary:", error);
    }
  };

  const handlePlaceOrder = () => {
    dispatch(
      placeOrder({
        items: cartItems.map((item) => ({
          productId: item.id || "placeholder-id",
          productName: item.name || "Unknown Product",
          price: item.buyerPrice || 0,
          quantity: item.quantity || 1,
          buyerPrice: item.buyerPrice,
          sellerPrice: item.sellerPrice,
          discount: item.discount || 0,
        })),
        shippingAddress: shippingAddress
          ? [
            {
              fullName: shippingAddress.fullName || "Default Name",
              email: shippingAddress.email || "default@example.com",
              phoneNumber: shippingAddress.phoneNumber || "000-000-0000",
              addressLine1: shippingAddress.addressLine1 || "",
              addressLine2: shippingAddress.addressLine2 || "",
              city: shippingAddress.city || "",
              state: shippingAddress.state || "",
              postalCode: shippingAddress.postalCode || "",
              country: shippingAddress.country || "",
              street: shippingAddress.street || "Default Street",
              firstName: shippingAddress.firstName || "Default First Name",
              lastName: shippingAddress.lastName || "Default Last Name",
            },
          ]
          : [],
        billingAddress: billingAddress
          ? [
            {
              fullName: billingAddress.fullName || "Default Name",
              email: billingAddress.email || "default@example.com",
              phoneNumber: billingAddress.phoneNumber || "000-000-0000",
              addressLine1: billingAddress.addressLine1 || "",
              addressLine2: billingAddress.addressLine2 || "",
              city: billingAddress.city || "",
              state: billingAddress.state || "",
              postalCode: billingAddress.postalCode || "",
              country: billingAddress.country || "",
              street: billingAddress.street || "Default Street",
              firstName: billingAddress.firstName || "Default First Name",
              lastName: billingAddress.lastName || "Default Last Name",
            },
          ]
          : [],
        paymentMethod: paymentMethod?.cardType || "",
        totalBuyerPrice,
        discount,
        deliveryOption: deliveryOption || undefined,
      })
    );
  };


  const goToStep = (step: number) => {
    dispatch(setCurrentStep(step));
  };

  return (
    <OrderReviewCard>
      <SectionTitle>{getLocalizedText("orderReview", "checkout")}</SectionTitle>
      <Divider />

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "20px" }} />}

      <SectionTitle>{getLocalizedText("shippingAddress", "checkout")}</SectionTitle>
      <AddressDetails>
        <p>
          {shippingAddress
            ? `${shippingAddress.firstName || ""} ${shippingAddress.lastName || ""}, ${shippingAddress.street || ""
            }, ${shippingAddress.city || ""}, ${shippingAddress.state || ""}, ${shippingAddress.postalCode || ""
            }, ${shippingAddress.country || ""}`
            : getLocalizedText("noShippingAddress", "checkout")}
        </p>
        <a onClick={() => goToStep(1)}>{getLocalizedText("edit", "checkout")}</a>
      </AddressDetails>
      <Divider />

      <SectionTitle>{getLocalizedText("orderSummary", "checkout")}</SectionTitle>
      <SummaryList>
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={
                  <>
                    <span>{`${getLocalizedText("quantity", "checkout")}: ${item.quantity}`}</span>
                    <span>{`${getLocalizedText("sellerPrice", "checkout")}: ${formatCurrency(
                      item.sellerPrice,
                      sellerCurrency || "USD"
                    )}`}</span>
                    <span>{`${getLocalizedText("buyerPrice", "checkout")}: ${formatCurrency(
                      item.buyerPrice,
                      buyerCurrency || "USD"
                    )}`}</span>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </SummaryList>
      <Divider />
      <PriceDetails>
        <span>
          <strong>{getLocalizedText("totalSellerPrice", "checkout")}:</strong>{" "}
          {formatCurrency(totalSellerPrice, sellerCurrency || "USD")}
        </span>
        <span>
          <strong>{getLocalizedText("totalBuyerPrice", "checkout")}:</strong>{" "}
          {formatCurrency(totalBuyerPrice, buyerCurrency || "USD")}
        </span>
        <span>
          <strong>{getLocalizedText("shippingCost", "checkout")}:</strong>{" "}
          {formatCurrency(totalShippingCost, buyerCurrency || "USD")}
        </span>
        <span>
          <strong>{getLocalizedText("tax", "checkout")}:</strong>{" "}
          {formatCurrency(totalTax, buyerCurrency || "USD")}
        </span>
        <span>
          <strong>{getLocalizedText("grandTotal", "checkout")}:</strong>{" "}
          {formatCurrency(grandTotal, buyerCurrency || "USD")}
        </span>
      </PriceDetails>
      <Divider />

      <ButtonContainer>
        <Button type="default" onClick={() => goToStep(0)}>
          {getLocalizedText("backToCart", "checkout")}
        </Button>
        <Button type="primary" loading={loading} onClick={handlePlaceOrder}>
          {getLocalizedText("placeOrder", "checkout")}
        </Button>
      </ButtonContainer>
    </OrderReviewCard>
  );
};

export default OrderReview;
