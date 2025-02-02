import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCurrentStep,
  validateLinkExpiration,
  sendRegistrationEmail,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import CombinedInformationForm from "../Registration/CompanyForms/CombinedInformationForm";
import { RootState, AppDispatch } from "../../redux/store";

interface StepProps {
  registrationData: {
    businessLocation?: string;
    businessType?: string;
    businessName?: string;
    companyName?: string;
    companyRegistrationNumber?: string;
    taxId?: string;
    countryOfIncorporation?: string;
    businessAddress?: string;
    phoneNumber?: string;
    contactPersonFirstName?: string;
    contactPersonMiddleName?: string;
    contactPersonLastName?: string;
    smsVerificationLanguage?: string;
    verificationMethod?: string;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "combined_information", "review_and_submit"]; // Adjusted steps

const CompanyInformationStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step on mount
  useEffect(() => {
    dispatch(setCurrentStep("combined_information"));
  }, [dispatch]);

  // Validate link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Handle incremental updates to registration data
  const handleUpdate = (updatedData: Record<string, any>) => {
    const mergedData = { ...registrationData, ...updatedData };
    updateStep("combined_information", mergedData); // Update only the data, no navigation
  };

  // Handle submission and move to the next step
  const handleSubmit = () => {
    dispatch(sendRegistrationEmail("combined_information"));
    updateStep("review_and_submit", registrationData); // Navigate to the next step
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Combined Information</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Render Combined Form */}
      <CombinedInformationForm
        data={registrationData}
        onUpdate={handleUpdate}
        onSubmit={handleSubmit}
        onNext={handleSubmit} // Same as submit, since the form contains all sections
      />
    </div>
  );
};

export default CompanyInformationStep;
