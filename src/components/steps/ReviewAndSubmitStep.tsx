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
import ReviewAndSubmit from "../Registration/ReviewAndSubmit";


interface StepProps {
  registrationData: Record<string, any>;
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "contact_details", "payment_details", "review_and_submit"]; // Define steps for progress

const ReviewAndSubmitStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Transform `registrationData` into the expected structure
  const transformedData = {
    accountDetailsData: {
      full_name: registrationData.full_name || "",
      email: registrationData.email || "",
      password: registrationData.password || "",
    },
    contactDetailsData: {
      firstName: registrationData.firstName || "",
      middleName: registrationData.middleName || "",
      lastName: registrationData.lastName || "",
      residentialAddress: registrationData.residentialAddress || "",
      phoneNumber: registrationData.phoneNumber || "",
      countryOfCitizenship: registrationData.countryOfCitizenship || "",
      countryOfResidence: registrationData.countryOfResidence || "",
      postalCode: registrationData.postalCode || "",
      building: registrationData.building || "",
      state: registrationData.state || "",
      dateOfBirth: registrationData.dateOfBirth || { day: "", month: "", year: "" },
      passportInfo: registrationData.passportInfo || {
        passportNumber: "",
        countryOfIssue: "",
        expiryDate: { day: "", month: "", year: "" },
      },
    },
    paymentDetails: registrationData.paymentDetails || {
      cardNumber: "",
      cardholderName: "",
      expiryDate: { month: "", year: "" },
      billingAddress: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    },
    shopSetupData: registrationData.shopSetupData || {
      storeName: "",
      productCategories: [],
      businessAddress: "",
      shippingDetails: "",
      returnPolicy: "",
    },
    verificationData: registrationData.verificationData || {
      identityDocument: null,
      businessDocument: null,
      additionalComments: "",
    },
    sellerType: registrationData.sellerType || "individual",
  };

  // Set the current step on mount
  useEffect(() => {
    dispatch(setCurrentStep("review_and_submit"));
  }, [dispatch]);

  // Validate link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Handle final form submission
  const handleFinalSubmit = () => {
    console.log("Final data submitted:", registrationData);
    dispatch(sendRegistrationEmail("dashboard"));
    updateStep("dashboard");
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Review & Submit</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the Review and Submit Form */}
      <ReviewAndSubmit
        data={transformedData} // Pass transformed data
        onSubmit={handleFinalSubmit} // Handle final submission
      />
    </div>
  );
};

export default ReviewAndSubmitStep;
