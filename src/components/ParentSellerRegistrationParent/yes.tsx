import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setCurrentStep,
  sendRegistrationEmail,
} from "../../redux/slices/auth/registrationSlice";
import SellerRegistrationLayout from "components/layout/SellerRegistrationLayout";

// Steps
import CompanyInformationStep from "../steps/CompanyInformationStep";
import IdentityVerificationStep from "../steps/IdentityVerificationStep";
import BankAccountVerificationStep from "../steps/BankAccountVerificationStep";
import BusinessDocumentationStep from "../steps/BusinessDocumentationStep";

// Forms
import BusinessInformationForm from "../Registration/CompanyForms/BusinessInformationForm";
import SellerInformationForm from "../Registration/CompanyForms/SellerInformationForm";
import BillingInformationForm from "../Registration/CompanyForms/BillingInformationForm";

const ProfessionalSellerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );
    
 const {
        identityVerificationData,
        bankAccountVerificationData,
        acknowledgmentData,
      } = useSelector((state: RootState) => state.registration);

  const [businessData, setBusinessData] = useState({
    businessLocation: "",
    businessType: "",
    businessName: "",
  });

  const [sellerData, setSellerData] = useState({
    companyRegistrationNumber: "",
    businessAddress: "",
    phoneNumber: "",
    contactPersonFirstName: "",
    contactPersonMiddleName: "",
    contactPersonLastName: "",
  });

  const [billingData, setBillingData] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    phoneNumber: "",
    fullName: "",
    email: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
  });

  useEffect(() => {
    const now = Date.now();
    if (emailLinkExpiration && now > emailLinkExpiration) {
      alert("The link has expired. Please restart registration.");
      dispatch(setCurrentStep("create_account"));
      navigate("/register/seller/create-account");
    }
  }, [emailLinkExpiration, dispatch, navigate]);

  const updateStep = (step: string, data?: Record<string, any>) => {
    dispatch(setCurrentStep(step));
    dispatch(sendRegistrationEmail(step));
    navigate(`/register/seller/professional/${step}`);
  };
    
  const handleNextStep = (path: string) => {
    navigate(path);
  };

  const handleBusinessUpdate = (updatedData: Partial<typeof businessData>) => {
    setBusinessData((prev) => ({ ...prev, ...updatedData }));
  };

  const handleSellerUpdate = (updatedData: Partial<typeof sellerData>) => {
    setSellerData((prev) => ({ ...prev, ...updatedData }));
  };

  const handleBillingUpdate = (updatedData: Partial<typeof billingData>) => {
    setBillingData((prev) => ({ ...prev, ...updatedData }));
  };
    
  const defaultIdentityVerificationData = {
    idType: '',
    idNumber: '',
    expiryDate: '',
    issuingCountry: '',
    idDocument: undefined,
    selfieDocument: undefined,
  };

  const defaultBankAccountVerificationData = {
    accountNumber: '',
    bankName: '',
    routingCode: '',
    proofOfBankOwnership: undefined,
  };

  const defaultAcknowledgmentData = {
    consentGiven: false,
  };

  const registrationData = {
    identityVerificationData: {
      ...defaultIdentityVerificationData,
      ...identityVerificationData,
    },
    bankAccountVerificationData: {
      ...defaultBankAccountVerificationData,
      ...bankAccountVerificationData,
    },
    consentGiven: acknowledgmentData?.consentGiven || defaultAcknowledgmentData.consentGiven,
  };

  return (
    <Routes>
      {/* Company Information Route */}
      <Route
        path="company-information"
        element={
          <SellerRegistrationLayout currentStep={currentStep}> {/*"Company Information"*/}
            <CompanyInformationStep registrationData={{}} updateStep={updateStep} />
          </SellerRegistrationLayout>
        }
      />

      {/* Business Information Route */}
      <Route
        path="business-information"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <BusinessInformationForm
              data={businessData}
              onUpdate={handleBusinessUpdate}
              onNext={() => handleNextStep("/register/seller/professional/seller-information")}
            />
          </SellerRegistrationLayout>
        }
      />

      {/* Seller Information Route */}
      <Route
        path="seller-information"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <SellerInformationForm
              data={sellerData}
              onUpdate={handleSellerUpdate}
              onNext={() => handleNextStep("/register/seller/professional/billing-information")}
            />
          </SellerRegistrationLayout>
        }
      />

      {/* Billing Information Route */}
      <Route
        path="billing-information"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <BillingInformationForm
              data={billingData}
              onUpdate={handleBillingUpdate}
              onNext={() => handleNextStep("/register/seller/professional/identity-verification")}
            />
          </SellerRegistrationLayout>
        }
      />

      {/* Identity Verification Route */}
      <Route
        path="identity-verification"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>{/*"Identity Verification">*/}
        <IdentityVerificationStep
        registrationData={registrationData}
        updateStep={(step) => navigate(step)}
      />
          </SellerRegistrationLayout>
        }
      />

      {/* Bank Account Verification Route */}
      <Route
        path="bank-account-verification"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>{/*"Bank Account Verification">*/}
        <BankAccountVerificationStep
        registrationData={registrationData}
        updateStep={(step) => navigate(step)}
      />
          </SellerRegistrationLayout>
        }
      />

      {/* Business Documentation Route */}
      <Route
        path="business-documentation"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>{/*"Business Documentation">*/}
            <BusinessDocumentationStep registrationData={{}} updateStep={updateStep} />
          </SellerRegistrationLayout>
        }
      />
    </Routes>
  );
};

export default ProfessionalSellerRegistration;
