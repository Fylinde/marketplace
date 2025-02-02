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
import CombinedShopAndStoreForm from "../Registration/CombinedShopAndStoreForm";
import { ShopDetails } from "../../types/shop"; // Use the ShopDetails type

interface StepProps {
  registrationData: {
    shopSetupData: ShopDetails;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "contact_details", "payment_details", "shop_setup", "verification"]; // Define steps for progress calculation

const ShopSetupStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Set the current step on mount
  useEffect(() => {
    dispatch(setCurrentStep("shop_setup"));
  }, [dispatch]);

  // Validate link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Handle incremental updates
  const handleUpdate = (updatedData: Partial<ShopDetails>) => {
    const updatedShopSetupData = {
      ...registrationData.shopSetupData,
      ...updatedData,
    };
    updateStep("shop_setup", { shopSetupData: updatedShopSetupData });
  };

  // Handle moving to the next step
  const handleNext = () => {
    dispatch(sendRegistrationEmail("shop_setup"));
    updateStep("verification");
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Shop Setup</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the Shop Setup Form */}
      <CombinedShopAndStoreForm
        data={registrationData.shopSetupData} // Use ShopDetails type
        onUpdate={handleUpdate}
        onNext={handleNext}
      />
    </div>
  );
};

export default ShopSetupStep;
