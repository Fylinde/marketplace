import React from "react";
import { Steps } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentStep } from "../../redux/slices/orders/checkoutSlice";
import { RootState } from "../../redux/store";
import { StepsContainer, StepTitle, StepDescription } from "./styles/CheckoutSteps.styles";

const { Step } = Steps;

const CheckoutSteps: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.checkout.currentStep);

  const steps = [
    { title: "Cart", description: "Review your items" },
    { title: "Shipping", description: "Enter your shipping details" },
    { title: "Payment", description: "Provide payment information" },
    { title: "Review", description: "Confirm your order" },
    { title: "Confirmation", description: "Order placed!" },
  ];

  return (
    <StepsContainer>
      <Steps current={currentStep} onChange={(step) => dispatch(setCurrentStep(step))}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={<StepTitle>{step.title}</StepTitle>}
            description={<StepDescription>{step.description}</StepDescription>}
          />
        ))}
      </Steps>
    </StepsContainer>
  );
};

export default CheckoutSteps;
