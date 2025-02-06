import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentStep,
  verifySellerCodeThunk,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import CreateSellerAccount from "../Registration/CreateSellerAccount";
import { AccountDetails } from "../../types/sharedTypes";

interface StepProps {
  registrationData: Record<string, any>;
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "seller_verification", "type_selection"];

const CreateAccountStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentStep = useSelector((state: any) => state.registration.currentStep);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const accountDetails: AccountDetails = {
 
    full_name: "",
    email: "",
    phoneNumber: "",
    password: "",
    seller_type: "individual",  // ✅ Must be "individual" or "professional"
    currency_code: "USD",         // ✅ Required
    is_email_verified: false,     // ✅ Required (defaults to False)
    is_phone_verified: false,     // ✅ Required (defaults to False)
    profile_picture: null,        // ✅ Optional but explicitly sent as null
    preferences: null,            // ✅ Optional but explicitly sent as null
    verification_code: null,      // ✅ Optional but explicitly sent as null
    verification_expiration: null //
  };

  useEffect(() => {
    if (currentStep !== "create_account") {
      dispatch(setCurrentStep("create_account"));
    }
  }, [dispatch, currentStep]);

  const handleNext = () => {
    updateStep("seller_verification", accountDetails);
    navigate("/register/seller/seller-verification");
  };

  return (
    <div>
      <h1>Create Account</h1>
      <LinearProgress
        value={(steps.indexOf(currentStep) + 1) / steps.length * 100}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      <CreateSellerAccount
        data={accountDetails} // Ensure this is of type `AccountDetails`
        onUpdate={(data: Partial<AccountDetails>) => updateStep("create_account", { ...registrationData, ...data })}
        onNext={handleNext}
        onSubmit={(accountDetailsData: AccountDetails ) => {
          updateStep("create_account", { ...registrationData, ...accountDetailsData });
          navigate("/register/seller/individual/seller-verification");
          // if (verifyByLink) {
          //   navigate("/register/seller/professional/combined-information");
          // } else {
          //   navigate("/register/seller/professional/seller-verification");
          // }
        }}
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CreateAccountStep;
