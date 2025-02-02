import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentStep,
  validateLinkExpiration,
  setVerificationStatus,
  setVerificationError,
  selectSellerVerification,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import SellerVerificationForm from "../Registration/CompanyForms/SellerVerificationForm";
import { RootState } from "../../redux/store";
import axios from "axios";

const steps = ["create_account", "seller_verification", "type_selection"];

interface SellerVerificationStepProps {
  verificationError: string | null;
}

const SellerVerificationStep: React.FC<SellerVerificationStepProps> = ({ verificationError }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.registration.currentStep);
  const emailLinkExpiration = useSelector((state: RootState) => state.registration.emailLinkExpiration);
  const sellerVerification = useSelector(selectSellerVerification);

  const [manualVerificationTriggered, setManualVerificationTriggered] = useState(false);

  const triggerManualVerification = () => {
    setManualVerificationTriggered(true);
  };

  useEffect(() => {
    dispatch(setCurrentStep("seller_verification"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [emailLinkExpiration, dispatch, navigate]);

  useEffect(() => {
    if (!sellerVerification?.email) {
      console.error("Missing email in sellerVerification state. Redirecting...");
      navigate("/register/seller/create-account");
    }
  }, [sellerVerification, navigate]);

  useEffect(() => {
    if (!sellerVerification.email || !manualVerificationTriggered) return;

    console.log("Manually verifying with:", { email: sellerVerification.email });

    axios
      .post("http://localhost:8000/auth/verify-code", {
        email: sellerVerification.email,
        code: sellerVerification.verificationCode,
      })
      .then((response) => {
        if (response.data.isValid) {
          console.log("Verification successful, navigating to next step...");
          dispatch(setVerificationStatus(true));
          dispatch(setVerificationError(null));
          handleNext();
        } else {
          console.log("Verification failed.");
          dispatch(setVerificationError("Invalid verification code. Please try again."));
        }
      })
      .catch((error) => {
        console.error("Error during verification:", error);
        dispatch(setVerificationError("An error occurred during verification. Please try again."));
      });
  }, [sellerVerification, manualVerificationTriggered, dispatch]);

  const handleNext = () => {
    console.log("Redirecting to next step...");
    navigate("/register/seller/type-selection");
  };

  const onVerify = async (code: string): Promise<void> => {
    try {
      const response = await axios.post("http://localhost:8000/auth/verify-code", {
        email: sellerVerification.email,
        code,
      });

      if (response.data.isValid) {
        console.log("Verification successful, navigating to next step...");
        dispatch(setVerificationStatus(true));
        dispatch(setVerificationError(null));
        handleNext();
      } else {
        console.log("Verification failed.");
        dispatch(setVerificationError("Invalid verification code. Please try again."));
      }
    } catch (error) {
      console.error("Error during verification:", error);
      dispatch(setVerificationError("An error occurred during verification. Please try again."));
    }
  };

  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Seller Verification</h1>
      <LinearProgress value={progressPercentage} color="dynamic" thickness={10} label="Registration Progress" showValue />
      {verificationError && <p className="error-message">{verificationError}</p>}
      <SellerVerificationForm
        data={sellerVerification}
        onUpdate={() => {}} 
      />

    </div>
  );
};

export default SellerVerificationStep;
