import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCurrentStep,
  validateLinkExpiration,
  sendRegistrationEmail,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress"; // Import Progress Bar
import SMSCallVerificationForm from "../Registration/CompanyForms/SMSCallVerificationForm";
import { RootState, AppDispatch } from "../../redux/store";

interface StepProps {
  registrationData: {
    idVerificationData: {
      verificationMethod: string;
      phoneNumber: string;
      verificationLanguage: string;
      primaryContactFirstName: string;
      primaryContactMiddleName: string;
      primaryContactLastName: string;
    };
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "type_selection", "shop_setup", "sms/call_verification", "review_and_submit"]; // Define steps

const SMSCallVerificationStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step when the component mounts
  useEffect(() => {
    dispatch(setCurrentStep("sms/call_verification"));
  }, [dispatch]);

  // Validate the email link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Handle data updates
  const handleUpdate = (updatedData: Partial<typeof registrationData.idVerificationData>) => {
    const updatedIdVerificationData = {
      ...registrationData.idVerificationData,
      ...updatedData,
    };
    updateStep("sms/call_verification", { idVerificationData: updatedIdVerificationData });
  };

  // Handle moving to the next step
  const handleNext = () => {
    dispatch(sendRegistrationEmail("sms/call_verification"));
    updateStep("review_and_submit");
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>ID Verification</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the Form */}
      <SMSCallVerificationForm
        data={registrationData.idVerificationData}
        onUpdate={handleUpdate}
        onNext={handleNext}
      />
    </div>
  );
};

export default SMSCallVerificationStep;
