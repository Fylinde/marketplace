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
import BusinessInformationForm from "../Registration/CompanyForms/BusinessInformationForm";

interface StepProps {
  registrationData: {
    businessLocation: string;
    businessType: string;
    businessName: string;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "company-information", "business-information", "seller_information", "confirmation"];

const BusinessInformationStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step on mount
  useEffect(() => {
    dispatch(setCurrentStep("business-information"));
  }, [dispatch]);

  // Validate link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Update data during form interactions
  const handleUpdate = (newData: Partial<StepProps["registrationData"]>) => {
    updateStep("business-information", { ...registrationData, ...newData });
  };

  // Handle submission and move to the next step
  const handleSubmit = () => {
    dispatch(sendRegistrationEmail("business-information"));
    updateStep("seller_information", registrationData);
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  // Ensure registrationData has the correct structure for the form
  const formData = {
    ...{ businessLocation: "", businessType: "", businessName: "" },
    ...registrationData,
  };

  return (
    <div>
      <h1>Business Information</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the existing form */}
      <BusinessInformationForm
        data={formData}
        onUpdate={handleUpdate}
        onNext={handleSubmit}
      />
    </div>
  );
};

export default BusinessInformationStep;
