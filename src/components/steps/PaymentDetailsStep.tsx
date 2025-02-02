import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCurrentStep,
  sendRegistrationEmail,
  validateLinkExpiration,
  savePaymentDetails,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import PaymentDetailsForm from "../Registration/PaymentDetailsForm";
import { BillingAddress, PaymentDetails } from "../../types/sharedTypes";
import { RootState, AppDispatch } from "../../redux/store";

interface StepProps {
  registrationData: {
    paymentDetails: PaymentDetails;
    billingAddress: BillingAddress;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "contact_details", "payment_details", "confirmation"];

const PaymentDetailsStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  useEffect(() => {
    dispatch(setCurrentStep("payment_details"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  const handleUpdatePayment = (updatedData: Partial<PaymentDetails>) => {
    const updatedPaymentDetails = {
      ...registrationData.paymentDetails,
      ...updatedData,
    };
    dispatch(savePaymentDetails(updatedPaymentDetails));
    updateStep("payment_details", { paymentDetails: updatedPaymentDetails });
  };

  const handleSubmitPaymentToken = (token: string) => {
    console.log("Payment token received:", token);
  };

  const handleNext = () => {
    dispatch(sendRegistrationEmail("payment_details"));
    updateStep("confirmation", registrationData);
  };

  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Payment Details</h1>
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      <PaymentDetailsForm
        paymentDetails={registrationData.paymentDetails} // Only pass payment-related data
        onUpdatePayment={handleUpdatePayment}
        onSubmitPaymentToken={handleSubmitPaymentToken}
        onNext={handleNext}
      />
    </div>
  );
};

export default PaymentDetailsStep;
