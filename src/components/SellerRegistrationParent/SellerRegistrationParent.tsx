import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { AppDispatch } from '../../redux/store';
import {
  saveAccountDetails,
  saveContactDetails,
  savePaymentDetails,
  saveShopDetails,
  saveVerificationDetails,
  saveSellerVerification,
  saveCompanyDetails,
  saveBusinessInformation,
  saveCompanyInformation,
  saveSellerInformation,
  saveStoreInformation,
  saveBillingAddress,
  setSellerType,
  saveIdentityVerification,
  saveBankAccountVerification,
  saveBusinessDocumentation,
  saveContactPersonVerification,
  saveDocumentDetails,
  saveAcknowledgment,
  updateIdentityVerification,
  updateBankAccountVerification,
  updateBusinessDocumentation,
  updateContactPersonVerification,
  uploadDocument,

} from '../../redux/slices/auth/registrationSlice';

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
import { BusinessInformation, CompanyInformation, SellerInformation, StoreInformation } from '../../types/sharedTypes';
import SellerVerificationForm from '../Registration/CompanyForms/SellerVerificationForm';
import IdentityVerification from '../Registration/CompanyForms/IdentityVerification';
import BankAccountVerification from '../Registration/CompanyForms/BankAccountVerification';
import BusinessDocumentationForm from '../Registration/CompanyForms/BusinessDocumentationForm';
import DocumentUploadForm from '../Registration/CompanyForms/DocumentUpload';
import Acknowledgment from '../Registration/CompanyForms/Acknowledgment';
import { useParams } from 'react-router-dom';
import ContactPersonVerificationForm from '../Registration/CompanyForms/ContactPersonVerificationForm';
import DocumentUploadManager from '../Registration/CompanyForms/DocumentUploadManager';
import { FileMetadata as FileMetadataFromRegistration } from '../../types/sharedTypes';
import { FileMetadata as FileMetadataFromTypes } from '../../types/file-metadata';

// Define DocumentUpload interface separately to avoid name conflicts


const SellerRegistrationParent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Access data from Redux
  const sellerType = useSelector((state: RootState) => state.registration.sellerType);
  const accountDetailsData = useSelector((state: RootState) => state.registration.accountDetails);
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
  const identityVerificationData = useSelector((state: RootState) => state.registration.identityVerification);
  const bankAccountVerificationData = useSelector((state: RootState) => state.registration.bankAccountVerification);
  const businessDocumentationData = useSelector((state: RootState) => state.registration.businessDocumentation);
  const contactPersonVerificationData = useSelector((state: RootState) => state.registration.contactPersonVerification);
  const acknowledgmentData = useSelector((state: RootState) => state.registration.acknowledgment);
  const sellerVerificationInfo = useSelector((state: RootState) => state.registration.sellerVerification);


  // Initialize acknowledgmentData with a `consent` property
  //const [acknowledgmentData, setAcknowledgmentData] = useState({ consent: false });

  // Redirect to type selection if no type is set
  useEffect(() => {
    if (!sellerType) {
      navigate('/register/seller/type-selection');
    }
  }, [sellerType, navigate]);

  const handleFileUpload = async (file: File, type: string) => {
    const dispatch = useDispatch<AppDispatch>();

    try {
      const result = (await dispatch(uploadDocument(file)).unwrap()) as FileMetadataFromTypes;

      switch (type) {
        case 'idDocument':
          dispatch(updateIdentityVerification({ idDocument: result as FileMetadataFromRegistration }));
          break;
        case 'selfieDocument':
          dispatch(updateIdentityVerification({ selfieDocument: result }));
          break;
        case 'proofOfBankOwnership':
          dispatch(updateBankAccountVerification({ proofOfBankOwnership: result }));
          break;
        case 'businessRegistrationDocument':
          dispatch(updateBusinessDocumentation({ businessRegistrationDocument: result }));
          break;
        case 'taxDocument':
          dispatch(updateBusinessDocumentation({ taxDocument: result }));
          break;
        case 'authorizationLetter':
          dispatch(updateContactPersonVerification({ authorizationLetter: result }));
          break;
        case 'companyStampOrSeal':
          dispatch(updateContactPersonVerification({ companyStampOrSeal: result }));
          break;
        default:
          console.warn(`Unhandled file type: ${type}`);
      }
    } catch (error) {
      console.error(`Failed to upload file for ${type}:`, error);
    }
  };


  const handleAccountDetailsUpdate = (updatedData: Partial<typeof accountDetailsData>) => {
    dispatch(saveAccountDetails({ ...accountDetailsData, ...updatedData }));
  };
  const handleIdentityVerificationUpdate = (updatedData: Partial<typeof identityVerificationData>) => {
    dispatch(saveIdentityVerification({ ...identityVerificationData, ...updatedData }));
  };
  const handleBankAccountVerificationUpdate = (updatedData: Partial<typeof bankAccountVerificationData>) => {
    dispatch(saveBankAccountVerification({ ...bankAccountVerificationData, ...updatedData }));
  };
  const handleBusinessDocumentationUpdate = (updatedData: Partial<typeof businessDocumentationData>) => {
    dispatch(saveBusinessDocumentation({ ...businessDocumentationData, ...updatedData }));
  };
  const handleContactPersonVerificationUpdate = (updatedData: Partial<typeof contactPersonVerificationData>) => {
    dispatch(saveContactPersonVerification({ ...contactPersonVerificationData, ...updatedData }));
  };

  const handleSellerVerificationUpdate = (updatedData: Partial<typeof sellerVerificationInfo>) => {
    dispatch(saveSellerVerification({ ...sellerVerificationInfo, ...updatedData }));
  };
  const handleAcknowledgmentUpdate = (updatedData: { consentGiven: boolean }) => {
    dispatch(saveAcknowledgment(updatedData));
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
      accountDetailsData,
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
      sellerVerificationInfo,
      identityVerificationData,
      bankAccountVerificationData,
      businessDocumentationData,
      contactPersonVerificationData,
      acknowledgmentData
    };
    console.log('Combined Data:', combinedData);
    navigate('/vendor-dashboard');
  };


  return (
    <Routes>

      <Route
        path="create"
        element={
          <SellerRegistrationLayout currentStep="Create Account">
            <CreateSellerAccount
              data={accountDetailsData}
              onUpdate={handleAccountDetailsUpdate}
              onNext={() => navigate('/register/seller/seller-verification')}
            />
          </SellerRegistrationLayout>
        }
      />


      <Route
        path="seller-verification"
        element={
          <SellerRegistrationLayout currentStep="Seller Verification">
            <SellerVerificationForm
              data={sellerVerificationInfo}
              onUpdate={handleSellerVerificationUpdate}
              onNext={() => navigate('/register/seller/type-selection')}
            />
          </SellerRegistrationLayout>
        }
      />


      <Route
        path="type-selection"
        element={
          <SellerRegistrationLayout currentStep="Type Selection">
            <TypeSelectionForm
              onTypeSelect={(type) => {
                // Set seller type in Redux
                dispatch(setSellerType(type));

                // Navigate based on the selected sellerType
                if (type === 'individual') {
                  navigate('/register/seller/individual/contact-details');
                } else if (type === 'professional') {
                  navigate('/register/seller/professional/company-information');
                } else {
                  // Handle unexpected type by navigating back to type selection
                  console.error("Invalid seller type:", type);
                  navigate('/register/seller/type-selection');
                }
              }}
            />
          </SellerRegistrationLayout>
        }
      />

      <Route
        path="individual/contact-details"
        element={
          <SellerRegistrationLayout currentStep="Contact Details">
            <ContactDetailsForm data={contactDetailsData}
              onUpdate={handleContactDetailsUpdate}
              onNext={() => navigate('/register/seller/individual/payment-details')} />
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
            <VerificationForm data={verificationData} onUpdate={handleVerificationUpdate} onNext={() => navigate('/register/seller/document-upload')} />
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
                  onNext={() => navigate('/register/seller/professional/contact-person')}
                />
              </SellerRegistrationLayout>
            }
          />
          <Route
            path="professional/contact-person"
            element={
              <SellerRegistrationLayout currentStep="Contact Person">
                <ContactPersonVerificationForm data={contactPersonVerificationData} onUpdate={handleContactPersonVerificationUpdate} onNext={() => navigate('/register/seller/professional/store-information')} />
              </SellerRegistrationLayout>
            }
          />
          <Route
            path="professional/store-information" //handleContactPersonVerificationUpdate
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
                <BillingInformationForm data={billingInfo} onUpdate={handleBillingInformationUpdate} onNext={() => navigate('/register/seller/professional/identity-verification')} />
              </SellerRegistrationLayout>
            }
          />

          <Route
            path="professional/identity-verification"
            element={
              <SellerRegistrationLayout currentStep="Identity Verification">
                <IdentityVerification
                  data={identityVerificationData}
                  onUpdate={(updatedData) => dispatch(updateIdentityVerification(updatedData))}
                  onIDUpload={(file) => handleFileUpload(file, 'idDocument')}
                  onSelfieUpload={(file) => handleFileUpload(file, 'selfieDocument')}
                  onNext={() => navigate('/register/seller/professional/bank-account-verification')}
                />
              </SellerRegistrationLayout>
            }
          />


          <Route
            path="professional/bank-account-verification"
            element={
              <SellerRegistrationLayout currentStep="Bank Account Verification">
                <BankAccountVerification
                  data={bankAccountVerificationData}
                  onUpdate={(updatedData) =>
                    dispatch(updateBankAccountVerification(updatedData))
                  }
                  onProofUpload={(file) => handleFileUpload(file, 'proofOfBankOwnership')}
                  onNext={() => navigate('/register/seller/professional/business-documentation')}
                />
              </SellerRegistrationLayout>
            }
          />


          <Route
            path="professional/business-documentation"
            element={
              <SellerRegistrationLayout currentStep="Business Documentation">
                <BusinessDocumentationForm
                  data={businessDocumentationData}
                  onUpdate={(updatedData) =>
                    dispatch(updateBusinessDocumentation(updatedData))
                  }
                  onNext={() => navigate('/register/seller/professional/acknowledgment')}
                />
              </SellerRegistrationLayout>
            }
          />

          <Route
            path="professional/acknowledgment"
            element={
              <SellerRegistrationLayout currentStep="Acknowledgment">
                <Acknowledgment
                  data={acknowledgmentData}
                  onUpdate={handleAcknowledgmentUpdate}
                  onNext={() => navigate('/register/seller/professional/review')}
                />
              </SellerRegistrationLayout>
            }
          />

        </>
      )}


      {/* Combined Review and Submit Route for Both Seller Types */}
        // In SellerRegistrationParent
      <Route
        path="review"
        element={
          <SellerRegistrationLayout currentStep="Review & Submit">
            <ReviewAndSubmit
              data={{
                accountDetailsData,
                contactDetailsData,
                paymentDetails,
                shopSetupData,
                verificationData,
                companyDetails,
                businessInfo,
                sellerInfo,
                sellerVerificationInfo,
                identityVerificationData: {
                  ...identityVerificationData,
                  idDocument: identityVerificationData.idDocument instanceof File
                    ? identityVerificationData.idDocument
                    : identityVerificationData.idDocument
                      ? new File([], identityVerificationData.idDocument.name || '', { type: identityVerificationData.idDocument.type })
                      : undefined,
                  selfieDocument: identityVerificationData.selfieDocument instanceof File
                    ? identityVerificationData.selfieDocument
                    : identityVerificationData.selfieDocument
                      ? new File([], identityVerificationData.selfieDocument.name || '', { type: identityVerificationData.selfieDocument.type })
                      : undefined,
                },
                bankAccountVerificationData: {
                  ...bankAccountVerificationData,
                  proofOfBankOwnership: bankAccountVerificationData.proofOfBankOwnership instanceof File
                    ? bankAccountVerificationData.proofOfBankOwnership
                    : bankAccountVerificationData.proofOfBankOwnership
                      ? new File([], bankAccountVerificationData.proofOfBankOwnership.name || '', { type: bankAccountVerificationData.proofOfBankOwnership.type })
                      : undefined,
                },
                businessDocumentationData: {
                  ...businessDocumentationData,
                  businessRegistrationDocument: businessDocumentationData.businessRegistrationDocument instanceof File
                    ? businessDocumentationData.businessRegistrationDocument
                    : businessDocumentationData.businessRegistrationDocument
                      ? new File([], businessDocumentationData.businessRegistrationDocument.name || '', { type: businessDocumentationData.businessRegistrationDocument.type })
                      : undefined,
                  taxDocument: businessDocumentationData.taxDocument instanceof File
                    ? businessDocumentationData.taxDocument
                    : businessDocumentationData.taxDocument
                      ? new File([], businessDocumentationData.taxDocument.name || '', { type: businessDocumentationData.taxDocument.type })
                      : undefined,
                },
                contactPersonVerificationData: {
                  ...contactPersonVerificationData,
                  authorizationLetter: contactPersonVerificationData.authorizationLetter instanceof File
                    ? contactPersonVerificationData.authorizationLetter
                    : contactPersonVerificationData.authorizationLetter
                      ? new File([], contactPersonVerificationData.authorizationLetter.name || '', { type: contactPersonVerificationData.authorizationLetter.type })
                      : undefined,
                  companyStampOrSeal: contactPersonVerificationData.companyStampOrSeal instanceof File
                    ? contactPersonVerificationData.companyStampOrSeal
                    : contactPersonVerificationData.companyStampOrSeal
                      ? new File([], contactPersonVerificationData.companyStampOrSeal.name || '', { type: contactPersonVerificationData.companyStampOrSeal.type })
                      : undefined,
                },
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