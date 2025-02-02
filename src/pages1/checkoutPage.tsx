import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Steps, Button, Space } from "antd";
import { fetchCartItems } from "../redux/slices/orders/cartSlice";
import { fetchPaymentMethods } from "../redux/slices/orders/paymentSlice";
import { setCurrentStep } from "../redux/slices/orders/checkoutSlice";
import CheckoutNavLayout from "../components/layout/CheckoutNavLayout";
import ShippingAddressForm from "../components/checkout/ShippingAddressForm";
import PaymentMethodForm from "../components/checkout/PaymentMethodForm";
import OrderSummary from "../components/checkout/OrderSummary";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { PageWithLayout } from "../types/pageLayouts";
import type { AppDispatch, RootState } from "../redux/store";

const { Step } = Steps;

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { cartList, totalBuyerPrice } = useSelector((state: RootState) => state.cart);
  const { currentStep } = useSelector((state: RootState) => state.checkout);

  useEffect(() => {
    // Preload cart and payment methods
    dispatch(fetchCartItems());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleNextStep = () => {
    if (currentStep === 3) {
      navigate("/order-review");
    } else {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handlePrevStep = () => {
    dispatch(setCurrentStep(Math.max(currentStep - 1, 0)));
  };

  if (!cartList.length) {
    return <div>Your cart is empty. Please add items to proceed.</div>;
  }

  return (
    <Card style={{ margin: "20px auto", maxWidth: "800px" }}>
      <Steps current={currentStep}>
        <Step title="Shipping Address" />
        <Step title="Payment Method" />
        <Step title="Order Summary" />
        <Step title="Review & Place Order" />
      </Steps>
      <div style={{ margin: "20px 0" }}>
        {currentStep === 0 && <ShippingAddressForm />}
        {currentStep === 1 && <PaymentMethodForm />}
        {currentStep === 2 && <OrderSummary />}
      </div>
      <Space style={{ display: "flex", justifyContent: "space-between" }}>
        {currentStep > 0 && (
          <Button onClick={handlePrevStep} type="default">
            Previous
          </Button>
        )}
        <Button
          type="primary"
          onClick={handleNextStep}
          disabled={currentStep === 3 && totalBuyerPrice === 0}
        >
          {currentStep === 3 ? "Place Order" : "Next"}
        </Button>
      </Space>
    </Card>
  );
};

// Wrap CheckoutPage with ProtectedRoute and Layout
const Page: PageWithLayout = () => (
  <ProtectedRoute>
    <CheckoutPage />
  </ProtectedRoute>
);

// Attach layout to the page
Page.getLayout = (page: React.ReactElement) => (
  <CheckoutNavLayout>{page}</CheckoutNavLayout>
);

export default Page;
