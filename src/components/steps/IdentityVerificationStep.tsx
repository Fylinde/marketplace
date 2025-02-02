import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCurrentStep,
  validateLinkExpiration,
  sendRegistrationEmail,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import IdentityVerification from "../Registration/CompanyForms/IdentityVerification";
import { RootState, AppDispatch } from "../../redux/store";
import { IdentityVerification as IdentityVerificationType } from "../../types/sharedTypes";

interface StepProps {
  registrationData: {
    identityVerificationData: IdentityVerificationType;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "type_selection", "identity_verification", "review_and_submit"];

const IdentityVerificationStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step when the component mounts
  useEffect(() => {
    dispatch(setCurrentStep("identity_verification"));
  }, [dispatch]);

  // Validate the email link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Handle incremental updates to identity verification data
  const handleUpdate = (updatedData: Partial<IdentityVerificationType>) => {
    const updatedIdentityVerificationData = {
      ...registrationData.identityVerificationData,
      ...updatedData,
    };
    updateStep("identity_verification", { identityVerificationData: updatedIdentityVerificationData });
  };

  // Handle file uploads (ID and selfie)
  const handleIDUpload = (file: File) => {
    console.log("Uploaded ID file:", file);
  };

  const handleSelfieUpload = (file: File) => {
    console.log("Uploaded selfie file:", file);
  };

  // Handle moving to the next step
  const handleNext = () => {
    dispatch(sendRegistrationEmail("identity_verification"));
    updateStep("review_and_submit");
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Identity Verification</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the IdentityVerification Form */}
      <IdentityVerification
        data={registrationData.identityVerificationData}
        onUpdate={handleUpdate}
        onNext={handleNext}
        onIDUpload={handleIDUpload}
        onSelfieUpload={handleSelfieUpload}
      />
    </div>
  );
};

export default IdentityVerificationStep;
