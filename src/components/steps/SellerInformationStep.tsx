import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCurrentStep,
  validateLinkExpiration,
  sendRegistrationEmail,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import SellerInformationForm from "../Registration/CompanyForms/SellerInformationForm";
import { RootState, AppDispatch } from "../../redux/store";


interface StepProps {
  registrationData: {
    sellerInformationData: {
      companyRegistrationNumber: string;
      businessAddress: string;
      phoneNumber: string;
      contactPersonFirstName: string;
      contactPersonMiddleName: string;
      contactPersonLastName: string;
    };
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "type_selection", "seller_information", "review_and_submit"]; // Define steps

const SellerInformationStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step when the component mounts
  useEffect(() => {
    dispatch(setCurrentStep("seller_information"));
  }, [dispatch]);

  // Validate the email link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Handle incremental updates to seller information data
  const handleUpdate = (updatedData: Partial<typeof registrationData.sellerInformationData>) => {
    const updatedSellerInformationData = {
      ...registrationData.sellerInformationData,
      ...updatedData,
    };
    updateStep("seller_information", { sellerInformationData: updatedSellerInformationData });
  };

  // Handle moving to the next step
  const handleNext = () => {
    dispatch(sendRegistrationEmail("seller_information"));
    updateStep("review_and_submit");
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Seller Information</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the SellerInformationForm */}
      <SellerInformationForm
        data={registrationData.sellerInformationData}
        onUpdate={handleUpdate}
        onNext={handleNext}
      />
    </div>
  );
};

export default SellerInformationStep;
