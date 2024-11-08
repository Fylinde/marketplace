import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  saveAccountDetails,
  saveContactDetails,
  savePaymentDetails,
  saveShopDetails,
  saveVerificationDetails,
  saveCompanyDetails,
  saveBusinessInformation,
  saveCompanyInformation,
  saveSellerInformation,
  saveStoreInformation,
  saveBillingAddress, 
  setSellerType,
  CompanyDetails 
} from '../../redux/slices/registrationSlice';

import SellerRegistrationLayout from 'components/layout/SellerRegistrationLayout';
import CreateSellerAccount from '../Registration/CreateSellerAccount';
import CompanyDetailsForm from '../Registration/CompanyDetailsForm';
import ContactDetailsForm from '../Registration/ContactDetailsForm';
import PaymentDetailsForm from '../Registration/PaymentDetailsForm';
import ShopSetupForm from '../Registration/ShopSetupForm';
import VerificationForm from '../Registration/VerificationForm';
import IdVerificationForm from '../Registration/CompanyForms/IdVerificationForm';
import CompanyInformationForm from '../Registration/CompanyForms/CompanyInformationForm';
import BusinessInformationForm from '../Registration/CompanyForms/BusinessInformationForm';
import SellerInformationForm from '../Registration/CompanyForms/SellerInformationForm';
import StoreInformationForm from '../Registration/CompanyForms/StoreInformationForm';
import BillingInformationForm from '../Registration/CompanyForms/BillingInformationForm';
import ReviewAndSubmit from '../Registration/ReviewAndSubmit';
import TypeSelectionForm from '../Registration/TypeSelectionForm';
import { BusinessInformation, CompanyInformation, SellerInformation, StoreInformation } from '../../redux/slices/registrationSlice';


const SellerRegistrationParent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Access data from Redux
  const sellerType = useSelector((state: RootState) => state.registration.sellerType);
  const accountDetails = useSelector((state: RootState) => state.registration.accountDetails);
  const contactDetailsData = useSelector((state: RootState) => state.registration.contactDetails);
  const paymentDetails = useSelector((state: RootState) => state.registration.paymentDetails);
  const shopSetupData = useSelector((state: RootState) => state.registration.shopDetails);
  const verificationData = useSelector((state: RootState) => state.registration.verificationDetails);
  const companyDetails = useSelector((state: RootState) => state.registration.companyDetails);
  const businessInfo = useSelector((state: RootState) => state.registration.businessInformation);
  const companyInfo = useSelector((state: RootState) => state.registration.companyInformation);
  const sellerInfo = useSelector((state: RootState) => state.registration.sellerInformation);
  const storeInfo = useSelector((state: RootState) => state.registration.storeInformation);
  const billingInfo = useSelector((state: RootState) => state.registration.billingAddress);


  // Redirect to type selection if no type is set
  useEffect(() => {
    if (!sellerType) {
      navigate('/register/seller/type-selection');
    }
  }, [sellerType, navigate]);


  // Dispatch functions to update Redux state
  const handleAccountDetailsUpdate = (updatedData: Partial<typeof accountDetails>) => {
    dispatch(saveAccountDetails({ ...accountDetails, ...updatedData }));
  };


  const handleContactDetailsUpdate = (updatedData: Partial<typeof contactDetailsData>) => {
    dispatch(saveContactDetails({ ...contactDetailsData, ...updatedData }));
  };


  const handlePaymentUpdate = (updatedData: Partial<typeof paymentDetails>) => {
    dispatch(savePaymentDetails({ ...paymentDetails, ...updatedData }));
  };


  const handleShopSetupUpdate = (updatedData: Partial<typeof shopSetupData>) => {
    dispatch(saveShopDetails({ ...shopSetupData, ...updatedData }));
  };


  const handleVerificationUpdate = (updatedData: Partial<typeof verificationData>) => {
    dispatch(saveVerificationDetails({ ...verificationData, ...updatedData }));
  };


  const handleCompanyDetailsUpdate = (updatedData: Partial<typeof companyDetails>) => {
    dispatch(saveCompanyDetails({ ...companyDetails, ...updatedData }));
  };


  const handleBusinessInformationUpdate = (updatedData: Partial<BusinessInformation>) => {
    dispatch(
      saveBusinessInformation({
        businessLocation: businessInfo?.businessLocation || "",
        businessType: businessInfo?.businessType || "",
        businessName: businessInfo?.businessName || "",
        businessWebsite: businessInfo?.businessWebsite || "",
        industryType: businessInfo?.industryType || "",
        numberOfEmployees: businessInfo?.numberOfEmployees || "",
        ...updatedData,
      })
    );
  };

  const handleCompanyInformationUpdate = (updatedData: Partial<typeof companyInfo>) => {
    dispatch(saveCompanyInformation({ ...companyInfo, ...updatedData }));
  };
 
  const handleSellerInformationUpdate = (updatedData: Partial<typeof sellerInfo>) => {
    dispatch(saveSellerInformation({ ...sellerInfo, ...updatedData }));
  };


  const handleStoreInformationUpdate = (updatedData: Partial<typeof storeInfo>) => {
    dispatch(saveStoreInformation({ ...storeInfo, ...updatedData }));
  };


  const handleBillingInformationUpdate = (updatedData: Partial<typeof billingInfo>) => {
    dispatch(saveBillingAddress({ ...billingInfo, ...updatedData }));
  };


  // Submit final data
  const handleFormSubmit = () => {
    const combinedData = {
      accountDetails,
      contactDetailsData,
      paymentDetails,
      shopSetupData,
      verificationData,
      companyDetails,
      businessInfo,
      companyInfo,
      sellerInfo,
      storeInfo,
      billingInfo,
      sellerType,
    };
    console.log('Combined Data:', combinedData);
    navigate('/vendor-dashboard');
  };


  return (
 


      <Routes>
        <Route
          path="type-selection"
          element={
            <SellerRegistrationLayout currentStep="Type Selection">
              <TypeSelectionForm
                onTypeSelect={(type) => {
                  dispatch(setSellerType(type));
                  navigate('/register/seller/create');
                }}
              />
            </SellerRegistrationLayout>
          }
        />


        {/* Create Account Route for Both Seller Types */}
        <Route
          path="create"
          element={
            <SellerRegistrationLayout currentStep="Create Account">
              <CreateSellerAccount 
                onNext={() => {
                  // Check the sellerType and navigate to the appropriate path
                  if (sellerType === 'individual') {
                    navigate('/register/seller/individual/contact-details');
                  } else if (sellerType === 'professional') {
                    navigate('/register/seller/professional/company-information');
                  } else {
                    // Fallback if sellerType is not set or is invalid
                    console.error("Invalid sellerType:", sellerType);
                    navigate('/register/seller/type-selection'); // Redirect to type selection if sellerType is invalid
                  }
                }}
              />
            </SellerRegistrationLayout>
          }
        />

        {/* Route for Company Details Form */}
        <Route
          path="company-details"
          element={
            <SellerRegistrationLayout currentStep="Company Details">
              <CompanyDetailsForm
                data={{
                  ...companyDetails,
                  companyName: companyDetails?.companyName || "",  // Ensure companyName is a non-undefined string
                }}
                onUpdate={(data) =>
                  dispatch(
                    saveCompanyDetails({
                      ...data,
                      companyName: data.companyName || "",  // Provide default empty string for companyName
                    } as CompanyDetails) // Type cast to match `CompanyDetails` type requirements
                  )
                }
                onNext={() => navigate('/register/seller/contact-details')}
              />
            </SellerRegistrationLayout>
          }
        />

        {/* Conditional Routes Based on Seller Type */}
        {/* {sellerType === 'individual' && (
          <> */}
            <Route
              path="individual/contact-details"
              element={
                <SellerRegistrationLayout currentStep="Contact Details">
                  <ContactDetailsForm data={contactDetailsData} onUpdate={handleContactDetailsUpdate} onNext={() => navigate('/register/seller/individual/payment-details')} />
                </SellerRegistrationLayout>
              }
            />
            <Route
              path="individual/payment-details"
              element={
                <SellerRegistrationLayout currentStep="Payment Details">
                  <PaymentDetailsForm data={paymentDetails} onUpdatePayment={handlePaymentUpdate} onUpdateBillingAddress={handleBillingInformationUpdate} onNext={() => navigate('/register/seller/individual/verification')} />
                </SellerRegistrationLayout>
              }
               />
              <Route
              path="individual/shop-setup"
              element={
                <SellerRegistrationLayout currentStep="Shop Setup">
                  <ShopSetupForm data={shopSetupData} onUpdate={handleShopSetupUpdate} onNext={() => navigate('/register/seller/individual/verification')} />
                </SellerRegistrationLayout>
              }
            />
            <Route
              path="individual/verification"
              element={
                <SellerRegistrationLayout currentStep="Verification">
                  <VerificationForm data={verificationData} onUpdate={handleVerificationUpdate} onNext={() => navigate('/register/seller/review')} />
                </SellerRegistrationLayout>
              }
            />
          
        


        {sellerType === 'professional' && (
          <>

            <Route
              path="professional/company-information"
              element={
                <SellerRegistrationLayout currentStep="Company Information">
                  <CompanyInformationForm
                    data={{ businessInformation: businessInfo, companyInformation: companyInfo }}
                    onUpdate={(newData) => {
                      if (newData.businessInformation) {
                        handleBusinessInformationUpdate(newData.businessInformation);
                      }
                      if (newData.companyInformation) {
                        handleCompanyInformationUpdate(newData.companyInformation);
                      }
                    }}
                    onNext={() => navigate('/register/seller/professional/seller-information')}
                    onSubmit={handleFormSubmit}
                  />
                </SellerRegistrationLayout>
              }
            />
            <Route
              path="professional/seller-information"
              element={
                <SellerRegistrationLayout currentStep="Seller Information">
                  <SellerInformationForm
                    data={{
                      ...sellerInfo,
                      contactPersonMiddleName: sellerInfo.contactPersonMiddleName || "", // Default to empty string if undefined
                    }}
                    onUpdate={handleSellerInformationUpdate}
                    onNext={() => navigate('/register/seller/professional/store-information')}
                  />
                </SellerRegistrationLayout>
              }
            />
            <Route
              path="professional/store-information"
              element={
                <SellerRegistrationLayout currentStep="Store Information">
                  <StoreInformationForm data={storeInfo} onUpdate={handleStoreInformationUpdate} onNext={() => navigate('/register/seller/professional/billing-information')} />
                </SellerRegistrationLayout>
              }
            />
            <Route
              path="professional/billing-information"
              element={
                <SellerRegistrationLayout currentStep="Billing Information">
                  <BillingInformationForm data={billingInfo} onUpdate={handleBillingInformationUpdate} onNext={() => navigate('/register/seller/professional/id-verification')} />
                </SellerRegistrationLayout>
              }
            />
            <Route
              path="professional/id-verification"
              element={
                <SellerRegistrationLayout currentStep="ID Verification">
                  <IdVerificationForm
                    data={{
                      verificationMethod: verificationData?.verificationMethod || '',
                      phoneNumber: verificationData?.phoneNumber || '',
                      verificationLanguage: verificationData?.verificationLanguage || '',
                      primaryContactFirstName: verificationData?.primaryContactFirstName || '',
                      primaryContactMiddleName: verificationData?.primaryContactMiddleName || '',
                      primaryContactLastName: verificationData?.primaryContactLastName || '',
                    }}
                    onUpdate={handleVerificationUpdate}
                    onNext={() => navigate('/register/seller/review')}
                  />
                </SellerRegistrationLayout>
              }
            />
          </>
        )}


        {/* Combined Review and Submit Route for Both Seller Types */}
        <Route
          path="review"
          element={
            <SellerRegistrationLayout currentStep="Review & Submit">
              <ReviewAndSubmit
                data={{
                  accountDetails,
                  contactDetailsData,
                  paymentDetails,
                  shopSetupData,
                  verificationData,
                  companyDetails,
                  businessInfo,
                  sellerInfo,
                  storeInfo,
                  billingInfo,
                  sellerType,
                }}
                onSubmit={() => navigate('/vendor-dashboard')}
              />
            </SellerRegistrationLayout>
          }
        />
      </Routes>
   
  );
};


export default SellerRegistrationParent;