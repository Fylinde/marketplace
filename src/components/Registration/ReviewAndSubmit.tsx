import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ReviewContainer from './ReviewAndSubmitStyled';

interface ReviewAndSubmitProps {
  data: {
    accountDetailsData: {
      full_name: string;
      email: string;
      password: string;
    };
    contactDetailsData: {
      firstName: string;
      middleName?: string;
      lastName: string;
      residentialAddress: string;
      phoneNumber: string;
      countryOfCitizenship: string;
      countryOfResidence: string;
      postalCode: string;
      building: string;
      state: string;
      dateOfBirth: { day: string; month: string; year: string };
      passportInfo?: {
        passportNumber: string;
        countryOfIssue: string;
        expiryDate: { day: string; month: string; year: string };
      };
    };
    paymentDetails: {
      cardNumber: string;
      cardholderName: string;
      expiryDate: { month: string; year: string };
      billingAddress: {
        street: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
      };
    };
    shopSetupData: {
      storeName: string;
      productCategories: string[];
      businessAddress: string;
      shippingDetails: string;
      returnPolicy: string;
    };
    verificationData: {
      identityDocument: File | null;
      businessDocument: File | null;
      additionalComments?: string;
    };
    companyDetails?: {
      companyName: string;
      companyRegistrationNumber: string;
      taxId: string;
      countryOfIncorporation: string;
    };
    businessInfo?: {
      businessLocation: string;
      businessType: string;
      businessName: string;
    };
    sellerInfo?: {
      companyRegistrationNumber: string;
      businessAddress: string;
      phoneNumber: string;
      contactPersonFirstName: string;
      contactPersonMiddleName?: string;
      contactPersonLastName: string;
      smsVerificationLanguage: string;
      verificationMethod: string;
    };
    storeInfo?: {
      storeName: string;
      upc: string;
      manufacturerBrandOwner: string;
      trademarkOwnership: string;
    };
    billingInfo?: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    sellerVerificationInfo?: {
      // Define the structure for seller verification info as required
      verificationMethod: string;
      verificationStatus: string;
    };
    identityVerificationData?: {
      idDocument: File | undefined;
      selfieDocument: File | undefined;
    };
    bankAccountVerificationData?: {
      accountNumber: string;
      bankName: string;
      routingCode: string;
      proofOfBankOwnership?: File | undefined
    };
    businessDocumentationData?: {
      businessRegistrationDocument: File | undefined;
      taxDocument: File | undefined;
    };
    contactPersonVerificationData?: {
      fullName: string;
      position: string;
      contactEmail: string;
      contactPhoneNumber: string;
      authorizationLetter?: File | undefined;
      companyStampOrSeal?: File | undefined;
    };
    sellerType: 'individual' | 'professional';
  };
  onSubmit: () => void;
}

const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({ data, onSubmit }) => {
  const sellerType = useSelector((state: RootState) => state.registration.sellerType);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Add the basic data fields to FormData
      formData.append('accountDetails', JSON.stringify(data.accountDetailsData));
      formData.append('contactDetails', JSON.stringify(data.contactDetailsData));
      formData.append('paymentDetails', JSON.stringify(data.paymentDetails));
      formData.append('shopSetupData', JSON.stringify(data.shopSetupData));
      formData.append('verificationData', JSON.stringify({ additionalComments: data.verificationData.additionalComments || '' }));

      if (data.verificationData.identityDocument) {
        formData.append('identityDocument', data.verificationData.identityDocument);
      }
      if (data.verificationData.businessDocument) {
        formData.append('businessDocument', data.verificationData.businessDocument);
      }

      // Add extra information for professional sellers if applicable
      if (sellerType === 'professional') {
        formData.append('companyDetails', JSON.stringify(data.companyDetails));
        formData.append('businessInfo', JSON.stringify(data.businessInfo));
        formData.append('sellerInfo', JSON.stringify(data.sellerInfo));
        formData.append('storeInfo', JSON.stringify(data.storeInfo));
        formData.append('sellerVerificationInfo', JSON.stringify(data.sellerVerificationInfo));
        formData.append('identityVerificationData', JSON.stringify(data.identityVerificationData));
        formData.append('bankAccountVerificationData', JSON.stringify(data.bankAccountVerificationData));
        formData.append('businessDocumentationData', JSON.stringify(data.businessDocumentationData));
        formData.append('contactPersonVerificationData', JSON.stringify(data.contactPersonVerificationData));
      }

      // Set up the correct endpoint based on sellerType
      const endpoint = sellerType === 'professional' ? '/register_professional_vendor' : '/register_vendor';
      const response = await axios.post(`http://localhost:8012${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        console.log('Registration successful:', response.data);
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('There was an error with the registration. Please try again later.');
    }
  };

  return (
    <ReviewContainer>
      <h2>Review Your Information</h2>
      {/* Render sections similarly as in the original code */}
      <button onClick={handleSubmit} className="submit-button">Submit</button>
    </ReviewContainer>
  );
};

export default ReviewAndSubmit;
