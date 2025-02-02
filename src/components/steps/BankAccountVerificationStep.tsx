import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCurrentStep,
  validateLinkExpiration,
  sendRegistrationEmail,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import BankAccountVerification from "../Registration/CompanyForms/BankAccountVerification";
import { RootState, AppDispatch } from "../../redux/store";
import { BankAccountVerification as BankAccountVerificationType } from "../../types/sharedTypes";



interface StepProps {
  registrationData: {
    bankAccountVerificationData: BankAccountVerificationType;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "type_selection", "bank_account_verification", "review_and_submit"]; // Define steps

const BankAccountVerificationStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step when the component mounts
  useEffect(() => {
    dispatch(setCurrentStep("bank_account_verification"));
  }, [dispatch]);

  // Validate the email link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Handle incremental updates to bank account verification data
  const handleUpdate = (
    updatedData: Partial<BankAccountVerificationType>
  ) => {
    const updatedBankAccountVerificationData = {
      ...registrationData.bankAccountVerificationData,
      ...updatedData,
    };
    updateStep("bank_account_verification", {
      bankAccountVerificationData: updatedBankAccountVerificationData,
    });
  };

  // Handle moving to the next step
  const handleNext = () => {
    dispatch(sendRegistrationEmail("bank_account_verification"));
    updateStep("review_and_submit");
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Bank Account Verification</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the BankAccountVerification Form */}
      <BankAccountVerification
        data={registrationData.bankAccountVerificationData}
        onUpdate={handleUpdate}
        onNext={handleNext}
      />
    </div>
  );
};

export default BankAccountVerificationStep;
