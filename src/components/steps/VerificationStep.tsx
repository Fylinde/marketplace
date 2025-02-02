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
import VerificationForm from "../Registration/VerificationForm";
import { VerificationDetails } from "../../types/sharedTypes"; // Import VerificationDetails type
import { convertFileMetadataToFile } from "../../utils/convertFileMetadataToFile ";
interface StepProps {
  registrationData: {
    verificationDetails: VerificationDetails;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "type_selection", "shop_setup", "verification", "review_and_submit"]; // Define steps for progress

const VerificationStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step on mount
  useEffect(() => {
    dispatch(setCurrentStep("verification"));
  }, [dispatch]);

  // Validate link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Convert FileMetadata to File for VerificationForm
  const convertedVerificationDetails = {
    ...registrationData.verificationDetails,
    identityDocument: registrationData.verificationDetails.identityDocument
      ? convertFileMetadataToFile(registrationData.verificationDetails.identityDocument)
      : null,
    businessDocument: registrationData.verificationDetails.businessDocument
      ? convertFileMetadataToFile(registrationData.verificationDetails.businessDocument)
      : null,
  };

  // Handle incremental updates
  const handleUpdate = (updatedData: Partial<VerificationDetails>) => {
    const updatedVerificationDetails = {
      ...registrationData.verificationDetails,
      ...updatedData,
    };
    updateStep("verification", { verificationDetails: updatedVerificationDetails });
  };

  // Handle moving to the next step
  const handleNext = () => {
    dispatch(sendRegistrationEmail("verification"));
    updateStep("review_and_submit");
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Verification</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the Verification Form */}
      <VerificationForm
        data={convertedVerificationDetails} // Pass converted verification data
        onUpdate={handleUpdate} // Handle incremental updates
        onNext={handleNext} // Handle step transition
      />
    </div>
  );
};

export default VerificationStep;
