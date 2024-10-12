import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WelcomeScreen from '../Registration/WelcomeScreen';  // Include the WelcomeScreen
import CompanyInformationForm from '../Registration/CompanyForms/CompanyInformationForm';
import BillingInformationForm from '../Registration/CompanyForms/BillingInformationForm';
import BusinessInformationForm from '../Registration/CompanyForms/BusinessInformationForm';
import SellerInformationForm from '../Registration/CompanyForms/SellerInformationForm';
import StoreInformationForm from '../Registration/CompanyForms/StoreInformationForm';
import IdVerificationForm from '../Registration/CompanyForms/IdVerificationForm';
import ReviewAndSubmit from '../Registration/ReviewAndSubmit';
import CompanyDetailsForm from '../Registration/CompanyDetailsForm';  // Individual seller
import ContactDetailsForm from '../Registration/ContactDetailsForm';  // Individual seller
import PaymentDetailsForm from '../Registration/PaymentDetailsForm';  // Individual seller
import ShopSetupForm from '../Registration/ShopSetupForm';  // Individual seller
import VerificationForm from '../Registration/VerificationForm';  // Individual seller

const ParentComponent: React.FC = () => {
  const navigate = useNavigate();

  // States for both individual and professional forms
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyRegistrationNumber: '',
    taxId: '',
    countryOfIncorporation: '',
    businessAddress: ''
  });

  const [billingData, setBillingData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: { month: '', year: '' },
    billingAddress: { street: '', city: '', state: '', postal_code: '', country: '' }
  });

  const [businessData, setBusinessData] = useState({
    businessLocation: '',
    businessType: '',
    businessName: ''
  });

  const [sellerData, setSellerData] = useState({
    companyRegistrationNumber: '',
    businessAddress: '',
    phoneNumber: '',
    contactPersonFirstName: '',
    contactPersonMiddleName: '',
    contactPersonLastName: '',
    smsVerificationLanguage: 'English',
    verificationMethod: 'SMS',
  });

  const [storeData, setStoreData] = useState({
    storeName: '',
    upc: '',
    manufacturerBrandOwner: '',
    trademarkOwnership: ''
  });

  const [verificationData, setVerificationData] = useState({
    verificationMethod: 'SMS',
    phoneNumber: '',
    verificationLanguage: 'English',
    primaryContactFirstName: '',
    primaryContactMiddleName: '',
    primaryContactLastName: ''
  });

  const [contactDetailsData, setContactDetailsData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    residentialAddress: '',
    postalCode: '',
    building: '',
    state: '',
    phoneNumber: '',
    dateOfBirth: { day: '', month: '', year: '' },
    passportInfo: {
      passportNumber: '',
      countryOfIssue: '',
      expiryDate: { day: '', month: '', year: '' },
    },
  });

  const [shopSetupData, setShopSetupData] = useState({
    storeName: '',
    productCategories: [] as string[],
    businessAddress: '',
    shippingDetails: '',
    returnPolicy: ''
  });

  // Handlers to update form data
  const handleCompanyUpdate = (updatedData: Partial<typeof companyData>) => {
    setCompanyData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleBillingUpdate = (updatedData: Partial<typeof billingData>) => {
    setBillingData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleBusinessUpdate = (updatedData: Partial<typeof businessData>) => {
    setBusinessData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleSellerUpdate = (updatedData: Partial<typeof sellerData>) => {
    setSellerData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleStoreUpdate = (updatedData: Partial<typeof storeData>) => {
    setStoreData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleVerificationUpdate = (updatedData: Partial<typeof verificationData>) => {
    setVerificationData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleContactDetailsUpdate = (updatedData: Partial<typeof contactDetailsData>) => {
    setContactDetailsData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleShopSetupUpdate = (updatedData: Partial<typeof shopSetupData>) => {
    setShopSetupData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  // Function to handle form submission
  const handleFormSubmit = () => {
    console.log('Form submitted');
    const combinedData = {
      companyData,
      billingData,
      businessData,
      sellerData,
      storeData,
      verificationData,
      contactDetailsData,
      shopSetupData,
    };
    console.log('Combined Data:', combinedData);
  };

  // Handler to move to the next step
  const handleNextStep = (nextPath: string) => {
    navigate(nextPath);
  };

  return (
    <div>
      <h1>Seller Registration</h1>
      
      <Routes>
        {/* Welcome Screen */}
        <Route path="/" element={<WelcomeScreen />} />

        {/* Professional Seller Routes */}
        <Route
          path="professional/business-information"
          element={
            <BusinessInformationForm
              data={businessData}
              onUpdate={handleBusinessUpdate}
              onNext={() => handleNextStep('/register/professional/seller-information')}
            />
          }
        />
        <Route
          path="professional/seller-information"
          element={
            <SellerInformationForm
              data={sellerData}
              onUpdate={handleSellerUpdate}
              onNext={() => handleNextStep('/register/professional/store-information')}
            />
          }
        />
        <Route
          path="professional/store-information"
          element={
            <StoreInformationForm
              data={storeData}
              onUpdate={handleStoreUpdate}
              onNext={() => handleNextStep('/register/professional/billing-information')}
            />
          }
        />
        <Route
          path="professional/billing-information"
          element={
            <BillingInformationForm
              data={billingData}
              onUpdate={handleBillingUpdate}
              onNext={() => handleNextStep('/register/professional/id-verification')}
            />
          }
        />
        <Route
          path="professional/id-verification"
          element={
            <IdVerificationForm
              data={verificationData}
              onUpdate={handleVerificationUpdate}
              onNext={() => handleNextStep('/register/professional/review')}
            />
          }
        />
        <Route
          path="professional/review"
          element={
            <ReviewAndSubmit
              data={{ companyData, billingData, businessData, sellerData, storeData, verificationData }}
              onSubmit={handleFormSubmit}
            />
          }
        />

        {/* Individual Seller Routes */}
        <Route
          path="individual/company-details"
          element={<CompanyDetailsForm onNext={() => handleNextStep('/register/individual/contact-details')} />}
        />
        <Route
          path="individual/contact-details"
          element={<ContactDetailsForm onNext={() => handleNextStep('/register/individual/payment-details')} />}
        />
        <Route
          path="individual/payment-details"
          element={
            <PaymentDetailsForm
              data={billingData}
              onUpdate={handleBillingUpdate}
              onNext={() => handleNextStep('/register/individual/shop-setup')}
            />
          }
        />
        <Route
          path="individual/shop-setup"
          element={
            <ShopSetupForm
              data={shopSetupData}
              onUpdate={handleShopSetupUpdate}
              onNext={() => handleNextStep('/register/individual/verification')}
            />
          }
        />
        <Route
          path="individual/verification"
          element={<VerificationForm onNext={() => handleNextStep('/register/individual/review')} />}
        />
        <Route
          path="individual/review"
          element={
            <ReviewAndSubmit
              data={{ companyData, billingData, contactDetailsData, shopSetupData, verificationData }}
              onSubmit={handleFormSubmit}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default ParentComponent;
