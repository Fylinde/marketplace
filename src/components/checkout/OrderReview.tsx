import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List, Divider, Button, Alert } from "antd";
import { RootState } from "../../redux/store";
import { setCurrentStep } from "../../redux/slices/orders/checkoutSlice";
import { placeOrder } from "../../redux/slices/orders/orderSlice";
import priceCalculation from "../../utils/priceCalculations";
import shippingCalculator from "../../utils/shippingCalculator";
import taxService from "../../services/taxService";
import {
  OrderReviewCard,
  SectionTitle,
  AddressDetails,
  SummaryList,
  PriceDetails,
  ButtonContainer,
} from "./styles/OrderReview.styles";
import { AppDispatch } from "../../redux/store";


const OrderReview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    cartItems,
    shippingAddress,
    billingAddress,
    paymentMethod,
    discount,
    deliveryOption,
    currency,
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
      const priceResult = priceCalculation.calculate({
        items: cartItems.map((item) => ({
          buyerPrice: item.buyerPrice,
          sellerPrice: item.sellerPrice,
          quantity: item.quantity,
          discount: item.discount || 0,
          taxRate: 0,
        })),
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
        priceResult.totalBuyerPrice + totalShippingCost + taxData.taxAmount - priceResult.totalDiscount;

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
              phone: shippingAddress.phone || "000-000-0000",
              addressLine1: shippingAddress.addressLine1 || shippingAddress.street,
              addressLine2: shippingAddress.addressLine2 || "",
              city: shippingAddress.city,
              state: shippingAddress.state,
              postalCode: shippingAddress.postalCode,
              country: shippingAddress.country,
              zipCode: shippingAddress.postalCode, // Map `postalCode` to `zipCode`
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
              phone: billingAddress.phone || "000-000-0000",
              addressLine1: billingAddress.addressLine1 || billingAddress.street,
              addressLine2: billingAddress.addressLine2 || "",
              city: billingAddress.city,
              state: billingAddress.state,
              postal_code: billingAddress.postalCode,
              country: billingAddress.country,
              phone_number: billingAddress.phone || undefined,
              zipCode: billingAddress.postalCode,
              street: billingAddress.street || "Default Street",
              firstName: billingAddress.firstName || "Default First Name",
              lastName: billingAddress.lastName || "Default Last Name",
              postalCode: billingAddress.postalCode,
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
      <SectionTitle>Order Review</SectionTitle>
      <Divider />

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "20px" }} />}

      <SectionTitle>Shipping Address</SectionTitle>
      <AddressDetails>
        <p>
          {shippingAddress
            ? `${shippingAddress.firstName || ""} ${shippingAddress.lastName || ""}, ${shippingAddress.street || ""
            }, ${shippingAddress.city || ""}, ${shippingAddress.state || ""}, ${shippingAddress.postalCode || ""
            }, ${shippingAddress.country || ""}`
            : "No shipping address provided."}
        </p>

        <a onClick={() => goToStep(1)}>Edit</a>
      </AddressDetails>
      <Divider />

      <SectionTitle>Billing Address</SectionTitle>
      <AddressDetails>
        <p>
          {billingAddress
            ? `${billingAddress.firstName || ""} ${billingAddress.lastName || ""}, ${billingAddress.street || ""
            }, ${billingAddress.city || ""}, ${billingAddress.state || ""}, ${billingAddress.postalCode || billingAddress.zip || ""
            }, ${billingAddress.country || ""}`
            : "No billing address provided."}
        </p>
        <a onClick={() => goToStep(1)}>Edit</a>
      </AddressDetails>
      <Divider />

      <SectionTitle>Payment Method</SectionTitle>
      <AddressDetails>
        <p>
          {paymentMethod
            ? `${paymentMethod.cardType} ending in ${paymentMethod.cardNumber.slice(-4)}`
            : "No payment method provided."}
        </p>
        <a onClick={() => goToStep(2)}>Edit</a>
      </AddressDetails>
      <Divider />

      <SectionTitle>Delivery Option</SectionTitle>
      <AddressDetails>
        <p>
          {deliveryOption
            ? `${deliveryOption.date}, ${deliveryOption.time} (${deliveryOption.price} ${currency})`
            : "No delivery option selected."}
        </p>
        <a onClick={() => goToStep(3)}>Edit</a>
      </AddressDetails>
      <Divider />

      <SectionTitle>Order Summary</SectionTitle>
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
                    <span>{`Quantity: ${item.quantity}`}</span>
                    <span>{`Seller Price: ${item.sellerPrice.toFixed(2)} USD`}</span>
                    <span>{`Buyer Price: ${item.buyerPrice.toFixed(2)} ${currency}`}</span>
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
          <strong>Shipping Cost:</strong> {totalShippingCost.toFixed(2)} {currency}
        </span>
        <span>
          <strong>Tax:</strong> {totalTax.toFixed(2)} {currency}
        </span>
        <span>
          <strong>Discount:</strong> -{discount.toFixed(2)} {currency}
        </span>
        <span>
          <strong>Grand Total:</strong> {grandTotal.toFixed(2)} {currency}
        </span>
      </PriceDetails>
      <Divider />

      <ButtonContainer>
        <Button type="default" onClick={() => goToStep(0)}>
          Back to Cart
        </Button>
        <Button type="primary" loading={loading} onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </ButtonContainer>

    </OrderReviewCard>
  );
};

export default OrderReview;

