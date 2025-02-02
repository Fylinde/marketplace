import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setCurrentStep,
  sendRegistrationEmail,
  validateLinkExpiration,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import BillingInformationForm from "../Registration/CompanyForms/BillingInformationForm";

interface StepProps {
  registrationData: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    phoneNumber?: string;
    fullName?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "company-information", "business-information", "billing-information", "confirmation"];

const BillingInformationStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step on mount
  useEffect(() => {
    dispatch(setCurrentStep("billing-information"));
  }, [dispatch]);

  // Validate link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Update data during form interactions
  const handleUpdate = (newData: StepProps["registrationData"]) => {
    updateStep("billing-information", { ...registrationData, ...newData });
  };

  // Handle form submission and move to the next step
  const handleSubmit = () => {
    dispatch(sendRegistrationEmail("billing-information"));
    updateStep("identity-verification", registrationData);
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  // Ensure the form receives properly initialized data
  const formData = {
    street: "",
    city: "",
    state: "",
    country: "",
    phoneNumber: "",
    fullName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    ...registrationData,
  };

  return (
    <div>
      <h1>Billing Information</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the existing form */}
      <BillingInformationForm
        data={formData}
        onUpdate={handleUpdate}
        onNext={handleSubmit}
      />
    </div>
  );
};

export default BillingInformationStep;
