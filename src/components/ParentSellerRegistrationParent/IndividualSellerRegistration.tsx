import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setCurrentStep } from "../../redux/slices/auth/registrationSlice";
import SellerRegistrationLayout from "components/layout/SellerRegistrationLayout";
import CreateSellerAccount from "../Registration/CreateSellerAccount";
import SellerVerificationForm from "../Registration/CompanyForms/SellerVerificationForm";
import CombinedShopAndStoreForm from "../Registration/CombinedShopAndStoreForm";
import PaymentDetailsForm from "../Registration/PaymentDetailsForm";
import ContactDetailsForm from "../Registration/ContactDetailsForm";
import ReviewAndSubmit from "../Registration/ReviewAndSubmit";
import Acknowledgment from "../Registration/CompanyForms/Acknowledgment";
import { FileMetadata } from "../..//types/sharedTypes";
import { transformFileToMetadata } from "../../utils/transformFileToMetadata ";
import { SellerVerification } from "../..//types/sharedTypes";
import IdentityVerification from "../Registration/CompanyForms/IdentityVerification";
import { IdentityVerification as IdentityVerificationType } from "../../types/sharedTypes";
import TaxInformationForm from "../Registration/CompanyForms/TaxInformationForm"; // Import the Tax Information Form
import { verifySellerCodeThunk } from "../../redux/slices/auth/registrationSlice";
import { AccountDetails } from "../..//types/sharedTypes";

const steps = [
  { path: "/create-account", label: "Create Account" },
  { path: "/seller-verification", label: "Verify Seller" },
  { path: "/contact-details", label: "Contact Details" },
  { path: "/payment-details", label: "Payment Details" },
  { path: "/professional/tax-information", label: "Tax Information" },
  { path: "/shop-setup", label: "Shop Setup" },
  { path: "/review-and-submit", label: "Review and Submit" },
  { path: "/acknowledgment", label: "Acknowledgment" },
];

const IndividualSellerRegistration: React.FC = () => {
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
  useEffect(() => {
    if (email && code) {
      console.log("Email:", email);
      console.log("Code:", code);
      // Use these values as needed
    }
  }, [email, code]);

  
  // Update `currentStep` in Redux whenever the path changes
  useEffect(() => {
    const currentStepIndex = steps.findIndex((step) =>
      location.pathname.includes(step.path)
    );
    if (currentStepIndex >= 0) {
      dispatch(setCurrentStep(steps[currentStepIndex].label));
    }
  }, [location.pathname, dispatch]);

  // ✅ Prevents auto-verification; triggers only after user clicks the button
  useEffect(() => {
    if (!email || !code || !manualVerificationTriggered) return;

    console.log("Manually verifying with:", { email, code });

    dispatch(verifySellerCodeThunk({ email, code }))
      .unwrap()
      .then(() => {
        console.log("Verification successful");
        navigate("/register/seller/individual/contact-details");
      })
      .catch((error) => {
        console.error("Verification failed:", error);
        navigate("/register/seller/individual/seller-verification", {
          state: { error: "Verification failed. Please try again." },
        });
      });
  }, [email, code, manualVerificationTriggered, dispatch, navigate]);

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
        ...(prev[key] as object),
        ...updatedData,
      },
    }));
  };


  const handleNextStep = (nextPath: string) => {
    navigate(nextPath);
  };

  const handleFormSubmit = () => {
    console.log("Form Submitted:", formData);
  };

  return (
    <Routes>
      {/* Create Account */}
      {/* <Route
        path="create-account"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <CreateSellerAccount
              data={formData.accountDetailsData}
              onUpdate={(updatedData) => handleUpdate("accountDetailsData", updatedData)}
              onNext={() => handleNextStep("/register/seller/professional/seller-verification")}
              onSubmit={(accountDetailsData: AccountDetails ) => {
                handleUpdate("accountDetailsData", accountDetailsData);
                handleNextStep("/register/seller/individual/seller-verification");
                // if (verifyByLink) {
                //   handleNextStep("/register/seller/individual/combined-information");
                // } else {
                //  handleNextStep("/register/seller/individual/seller-verification");
                // }
              }}
            />
          </SellerRegistrationLayout>
        }
      /> */}

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



      {/* Contact Details */}
      <Route
        path="contact-details"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <ContactDetailsForm
              data={formData.contactDetailsData}
              onUpdate={(data) => handleUpdate("contactDetailsData", data)}
              onNext={() => handleNextStep("/register/seller/individual/payment-details")}
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
              onNext={() => handleNextStep("/register/seller/individual/tax-information")}
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
            onNext={() => handleNextStep("/register/seller/individual/identity-verification")}
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
              onNext={() => handleNextStep("/register/seller/individual/shop-setup")}
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
      {/* Shop Setup */}
      <Route
        path="shop-setup"
        element={
          <SellerRegistrationLayout currentStep={currentStep}>
            <CombinedShopAndStoreForm
              data={formData.shopSetupData}
              onUpdate={(data) => handleUpdate("shopSetupData", data)}
              onNext={() => handleNextStep("/register/seller/individual/acknowledgment")}
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
              onNext={() => handleNextStep("/register/seller/individual/review-and-submit")}
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

export default IndividualSellerRegistration;
