

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import SellerRegistrationLayout from "components/layout/SellerRegistrationLayout";
import CreateSellerAccount from "../Registration/CreateSellerAccount";
import SellerVerificationForm from "../Registration/CompanyForms/SellerVerificationForm";
import CombinedShopAndStoreForm from "../Registration/CombinedShopAndStoreForm";
import ReviewAndSubmit from "../Registration/ReviewAndSubmit";
import CombinedInformationForm from "../Registration/CompanyForms/CombinedInformationForm";
import BillingInformationForm from "../Registration/CompanyForms/BillingInformationForm";
import IdentityVerification from "../Registration/CompanyForms/IdentityVerification";
import BankAccountVerification from "../Registration/CompanyForms/BankAccountVerification";
import BusinessDocumentationForm from "../Registration/CompanyForms/BusinessDocumentationForm";
import Acknowledgment from "../Registration/CompanyForms/Acknowledgment";
import { SellerVerification } from "../../types/sharedTypes";
import { BillingAddress } from "../../types/sharedTypes";
import { IdentityVerification as IdentityVerificationType } from "../../types/sharedTypes";
import { FileMetadata } from "../../types/sharedTypes";
import { transformFileToMetadata } from "../../utils/transformFileToMetadata ";
import { BankAccountVerification as BankAccountVerificationType } from "../../types/sharedTypes";
import { BusinessDocumentation as BusinessDocumentationType } from "../../types/sharedTypes";
import { verifySellerCode } from "../../services/registrationService";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { setCurrentStep, updateRegistrationData } from "../../redux/slices/auth/registrationSlice";
import { verifySellerCodeThunk } from "../../redux/slices/auth/registrationSlice";
import TaxInformationForm from "../Registration/CompanyForms/TaxInformationForm"; // Import the Tax Information Form
import PaymentDetailsForm from "../Registration/PaymentDetailsForm";
import { AccountDetails } from "../../types/sharedTypes";



const steps = [
  { path: "/create-account", label: "Create Account" },
  { path: "/seller-verification", label: "Verify Seller" },
  { path: "/shop-setup", label: "Shop Setup" },
  { path: "/professional/combined-information", label: "Combined Information" },
  { path: "/payment-details", label: "Payment Details" },
  { path: "/professional/tax-information", label: "Tax Information" },
  { path: "/professional/billing-information", label: "Billing Information" },
  { path: "/professional/identity-verification", label: "Identity Verification" },
  { path: "/professional/bank-account-verification", label: "Bank Account Verification" },
  { path: "/professional/business-documentation", label: "Business Documentation" },
  { path: "/review-and-submit", label: "Review and Submit" },
  { path: "/acknowledgment", label: "Acknowledgment" },
];


const ProfessionalSellerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();


  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const code = queryParams.get("code");
  const [manualVerificationTriggered, setManualVerificationTriggered] = useState(false);

  const triggerManualVerification = () => {
    setManualVerificationTriggered(true);
  };
  
  const { sellerId } = useSelector((state: RootState) => state.registration);

  const { currentStep } = useSelector((state: RootState) => state.registration);

  // Update currentStep in Redux whenever the path changes
  React.useEffect(() => {
    const currentStepIndex = steps.findIndex((step) =>
      location.pathname.includes(step.path)
    );
    if (currentStepIndex >= 0) {
      dispatch(setCurrentStep(steps[currentStepIndex].label));
    }
  }, [location.pathname, steps, dispatch]);
  // Manage states for the forms
  const [formData, setFormData] = useState({
    accountDetailsData: {
      full_name: "",
      email: "",
      password: "",
    },
    contactDetailsData: {
      firstName: "",
      middleName: "",
      lastName: "",
      residentialAddress: "",
      phoneNumber: "",
      countryOfCitizenship: "",
      countryOfResidence: "",
      postalCode: "",
      building: "",
      state: "",
      dateOfBirth: { day: "", month: "", year: "" },
      passportInfo: {
        passportNumber: "",
        countryOfIssue: "",
        expiryDate: { day: "", month: "", year: "" },
      },
    },
    paymentDetails: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: { month: "", year: "" },
      cvv: "", // Add cvv
      billingAddress: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phoneNumber: "", // Ensure this field is included
        fullName: "", // Ensure this field is included
        email: "", // Ensure this field is included
        addressLine1: "",
        addressLine2: "",
        firstName: "",
        lastName: "",
      },
      currency: "USD", // Add currency with a default value
    },
    verificationData: {
      email: "",
      verificationCode: "",
      isVerified: false,
      verificationMethod: "",
      verificationStatus: "",
      verificationError: null as string | null,
      expirationTime: null as Date | null,
      identityDocument: null,
      businessDocument: null,
      additionalComments: "",
    },
    sellerType: "" as "individual" | "professional",
    shopSetupData: {
      storeName: "",
      productCategories: [] as string[],
      businessAddress: "",
      shippingDetails: "",
      returnPolicy: "",
          upc: "", // Add default value
    manufacturerBrandOwner: "", // Add default value
    trademarkOwnership: "", // Add default value
    },
    companyDetails: {
      companyName: "",
      companyRegistrationNumber: "",
      taxId: "",
      countryOfIncorporation: "",
    },
    businessInfo: {
      businessLocation: "",
      businessType: "",
      businessName: "",
    },
    sellerInfo: {
      companyRegistrationNumber: "",
      businessAddress: "",
      phoneNumber: "",
      contactPersonFirstName: "",
      contactPersonMiddleName: "",
      contactPersonLastName: "",
      smsVerificationLanguage: "English",
      verificationMethod: "SMS",
    },
    storeInfo: {
      storeName: "",
      upc: "",
      manufacturerBrandOwner: "",
      trademarkOwnership: "",
    },
    billingInfo: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    sellerVerificationInfo: {
      verificationMethod: "SMS",
      verificationStatus: "",
    },
    businessInformationData: { // Add this key
      businessLocation: "",
      businessType: "",
      businessName: "",
      companyName: "",
      companyRegistrationNumber: "",
      taxId: "",
      countryOfIncorporation: "",
      businessAddress: "",
      phoneNumber: "",
      contactPersonFirstName: "",
      contactPersonMiddleName: "",
      contactPersonLastName: "",
      smsVerificationLanguage: "",
      verificationMethod: "",
    },
    billingInformationData: { // Match the BillingAddress type
      street: "",
      city: "",
      state: "",
      country: "",
      phoneNumber: "",
      fullName: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      firstName: "",
      lastName: "",
    },
    identityVerificationData: {
      idType: "" as "" | "Passport" | "Driver’s License" | "National ID",
      idNumber: "",
      expiryDate: "",
      issuingCountry: "",
      idDocument: undefined as FileMetadata | undefined,
      selfieDocument: undefined as FileMetadata | undefined,
    },
    bankAccountVerificationData: {
      accountNumber: "",
      bankName: "",
      routingCode: "",
      proofOfBankOwnership: undefined as FileMetadata | undefined, // Matches the type
    },
    businessDocumentationData: {
      businessRegistrationDocument: undefined as FileMetadata | undefined,
      documentNumber: "",
      issuingAuthority: "",
      taxIdNumber: "",
      taxDocument: undefined as FileMetadata | undefined,
      taxCountryOfResidence: "",
    },
    contactPersonVerificationData: {
      fullName: "",
      position: "",
      contactEmail: "",
      contactPhoneNumber: "",
      authorizationLetter: undefined,
      companyStampOrSeal: undefined,
    },
    acknowledgmentData: {
      acceptedTerms: false, // Example field
      consentGiven: false,
    },
    taxInformationData: {
      taxId: "",
      vatNumber: "",
      country: "",
    },
  });

  const handleUpdate = <
    K extends keyof typeof formData,
    V extends Partial<typeof formData[K]>
  >(
    key: K,
    updatedData: V
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as object), // Ensure TypeScript treats this as an object
        ...updatedData,
      },
    }));
  };

  useEffect(() => {
    if (email && code) {
      console.log("Email:", email);
      console.log("Code:", code);
      // Use these values as needed
    }
  }, [email, code]);


  


  const handleNextStep = (nextPath: string) => {
    navigate(nextPath);
  };

  const handleFormSubmit = () => {
    console.log("Form Submitted:", formData);
  };


  return (
    <Routes>
      {/* Create Account */}
      <Route
        path="create-account"
        element={
          <SellerRegistrationLayout currentStep="create-account">
            <CreateSellerAccount
              data={formData.accountDetailsData}
              onUpdate={(updatedData) => handleUpdate("accountDetailsData", updatedData)}
              onNext={() => handleNextStep("/register/seller/professional/seller-verification")}
              onSubmit={(accountDetailsData: AccountDetails ) => {
                handleUpdate("accountDetailsData", accountDetailsData);
                handleNextStep("/register/seller/professional/seller-verification");

              }}
            />


          </SellerRegistrationLayout>
        }
      />

      {/* Verify Seller */}
      <Route
        path="seller-verification"
        element={
          <SellerRegistrationLayout currentStep="seller-verification">
            <SellerVerificationForm
              data={formData.verificationData}
              onUpdate={(data: Partial<SellerVerification>) => handleUpdate("verificationData", data)}
            />
          </SellerRegistrationLayout>
        }
      />


      {/* Professional Seller Routes */}
      <Route
        path="combined-information"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <CombinedInformationForm
              data={formData.businessInformationData} // Replace {} with the correct state slice
              onUpdate={(data) => handleUpdate("businessInformationData", data)}
              onSubmit={handleFormSubmit} // Define what happens on form submission
              onNext={() => handleNextStep("/register/seller/professional/payment-details")}
            />
          </SellerRegistrationLayout>

        }
      />
      {/* Payment Details */}
      <Route
        path="payment-details"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <PaymentDetailsForm
              paymentDetails={formData.paymentDetails}
              onUpdatePayment={(updatedData) => {
                handleUpdate("paymentDetails", {
                  ...formData.paymentDetails,
                  ...updatedData,
                });
              }}
              onSubmitPaymentToken={(token) => {
                console.log("Received Payment Token:", token); // Handle the token here
                // e.g., dispatch it to Redux or send it to the backend
              }}
              onNext={() => handleNextStep("/register/seller/professional/shop-setup")}
            />
          </SellerRegistrationLayout>
        }
      />
      <Route
        path="tax-information"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <TaxInformationForm
            sellerId={sellerId || undefined} // Transform null to undefined
            onUpdate={(data: { taxId: string; vatNumber?: string; country: string }) =>
              handleUpdate("taxInformationData", data)
            }
            onNext={() => handleNextStep("/register/seller/professional/billing-information")}
          />
          </SellerRegistrationLayout>
        }
      />

      <Route
        path="billing-information"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <BillingInformationForm
              data={formData.billingInformationData} // Use the updated state
              onUpdate={(data: Partial<BillingAddress>) =>
                handleUpdate("billingInformationData", data)
              }
              onNext={() => handleNextStep("/register/seller/professional/identity-verification")}
            />
          </SellerRegistrationLayout>
        }
      />
      <Route
        path="identity-verification"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <IdentityVerification
              data={formData.identityVerificationData} // Correct data
              onUpdate={(data: Partial<IdentityVerificationType>) =>
                handleUpdate("identityVerificationData", data)
              }
              onNext={() => handleNextStep("/register/seller/professional/bank-account-verification")}
              onIDUpload={(file) => {
                const metadata = transformFileToMetadata(file);
                handleUpdate("identityVerificationData", { idDocument: metadata });
              }}
              onSelfieUpload={(file) => {
                const metadata = transformFileToMetadata(file);
                handleUpdate("identityVerificationData", { selfieDocument: metadata });
              }}
            />
          </SellerRegistrationLayout>
        }
      />
      <Route
        path="bank-account-verification"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <BankAccountVerification
              data={formData.bankAccountVerificationData} // Correct data
              onUpdate={(data: Partial<BankAccountVerificationType>) =>
                handleUpdate("bankAccountVerificationData", data) // Correct key
              }
              onNext={() => handleNextStep("/register/seller/professional/business-documentation")} // Navigate to the next step
            />
          </SellerRegistrationLayout>
        }
      />

      <Route
        path="business-documentation"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <BusinessDocumentationForm
              data={formData.businessDocumentationData} // Use correct state slice
              onUpdate={(data: Partial<BusinessDocumentationType>) =>
                handleUpdate("businessDocumentationData", data) // Correct key
              }
              onNext={() => handleNextStep("/register/seller/professional/shop-setup")} // Navigate to next step
            />
          </SellerRegistrationLayout>
        }
      />


      {/* Shop Setup */}
      <Route
        path="shop-setup"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <CombinedShopAndStoreForm
              data={formData.shopSetupData}
              onUpdate={(data) => handleUpdate("shopSetupData", data)}
              onNext={() => handleNextStep("/register/seller/professional/acknowledgment")}
            />
          </SellerRegistrationLayout>
        }
      />
      <Route
        path="acknowledgment"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <Acknowledgment
              data={formData.acknowledgmentData} // Pass the updated acknowledgmentData
              onUpdate={(updatedData) => handleUpdate("acknowledgmentData", updatedData)}
              onNext={() => handleNextStep("/register/seller/professional/review-and-submit")}
            />
          </SellerRegistrationLayout>
        }
      />
      {/* Review and Submit */}
      <Route
        path="review-and-submit"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <ReviewAndSubmit
              data={formData} // Pass the full formData
              onSubmit={() => {
                handleFormSubmit(); // Perform submission logic
                navigate("/seller-dashboard/overview"); // Navigate to the seller's dashboard overview
              }}
            />
          </SellerRegistrationLayout>
        }
      />


    </Routes>

  );
};

export default ProfessionalSellerRegistration;
