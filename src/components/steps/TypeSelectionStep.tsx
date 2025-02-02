import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setCurrentStep,
  sendRegistrationEmail,
  validateLinkExpiration,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress"; // Reusable Progress Bar
import TypeSelectionForm from "../Registration/TypeSelectionForm";


interface StepProps {
  registrationData: Record<string, any>;
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "type_selection", "contact_details", "company-information"]; // Define steps for progress calculation

const TypeSelectionStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step on mount
  useEffect(() => {
    dispatch(setCurrentStep("type_selection"));
  }, [dispatch]);

  // Validate link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Handle type selection
  const handleSelectType = (type: "individual" | "professional") => {
    dispatch(sendRegistrationEmail("type_selection")); // Send continuation email
    updateStep("type_selection", {
      ...registrationData,
      sellerType: type,
    });
  };
  

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Type Selection</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the Type Selection Form */}
      <TypeSelectionForm onTypeSelect={handleSelectType} />
    </div>
  );
};

export default TypeSelectionStep;
