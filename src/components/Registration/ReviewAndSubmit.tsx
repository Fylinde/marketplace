import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ReviewContainer from './ReviewAndSubmitStyled';

interface ReviewAndSubmitProps {
  data: {
    accountDetails: {
      name: string;
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
      formData.append('accountDetails', JSON.stringify(data.accountDetails));
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

      {/* Account Details Section */}
      <div className="section">
        <h3>Account Details</h3>
        <p>Name: {data.accountDetails.name}</p>
        <p>Email: {data.accountDetails.email}</p>
        <p>Password: {data.accountDetails.password}</p>
      </div>

      {/* Conditional Sections Based on Seller Type */}
      {sellerType === 'individual' ? (
        <div className="section">
          <h3>Contact Details</h3>
          <p>First Name: {data.contactDetailsData.firstName}</p>
          <p>Middle Name: {data.contactDetailsData.middleName || 'N/A'}</p>
          <p>Last Name: {data.contactDetailsData.lastName}</p>
          <p>Residential Address: {data.contactDetailsData.residentialAddress}</p>
          <p>Phone Number: {data.contactDetailsData.phoneNumber}</p>
          <p>Country of Citizenship: {data.contactDetailsData.countryOfCitizenship}</p>
          <p>Country of Residence: {data.contactDetailsData.countryOfResidence}</p>
          <p>Postal Code: {data.contactDetailsData.postalCode}</p>
          <p>Building: {data.contactDetailsData.building}</p>
          <p>State: {data.contactDetailsData.state}</p>
          <p>Date of Birth: {`${data.contactDetailsData.dateOfBirth.day}-${data.contactDetailsData.dateOfBirth.month}-${data.contactDetailsData.dateOfBirth.year}`}</p>
        </div>
      ) : (
        <>
          <div className="section">
            <h3>Business Information</h3>
            <p>Business Location: {data.businessInfo?.businessLocation}</p>
            <p>Business Type: {data.businessInfo?.businessType}</p>
            <p>Business Name: {data.businessInfo?.businessName}</p>
          </div>
          <div className="section">
            <h3>Seller Information</h3>
            <p>Company Registration Number: {data.sellerInfo?.companyRegistrationNumber}</p>
            <p>Business Address: {data.sellerInfo?.businessAddress}</p>
            <p>Phone Number: {data.sellerInfo?.phoneNumber}</p>
          </div>
          <div className="section">
            <h3>Store Information</h3>
            <p>Store Name: {data.storeInfo?.storeName}</p>
            <p>UPC: {data.storeInfo?.upc}</p>
            <p>Manufacturer/Brand Owner: {data.storeInfo?.manufacturerBrandOwner}</p>
          </div>
        </>
      )}

      {/* Payment Details */}
      <div className="section">
        <h3>Payment Details</h3>
        <p>Card Number: {data.paymentDetails.cardNumber}</p>
        <p>Cardholder Name: {data.paymentDetails.cardholderName}</p>
        <p>Expiry Date: {`${data.paymentDetails.expiryDate.month}-${data.paymentDetails.expiryDate.year}`}</p>
        <h4>Billing Address:</h4>
        <p>Street: {data.paymentDetails.billingAddress.street}</p>
        <p>City: {data.paymentDetails.billingAddress.city}</p>
        <p>State: {data.paymentDetails.billingAddress.state}</p>
        <p>Postal Code: {data.paymentDetails.billingAddress.postal_code}</p>
        <p>Country: {data.paymentDetails.billingAddress.country}</p>
      </div>

      {/* Verification Data */}
      <div className="section">
        <h3>Verification Data</h3>
        <p>Identity Document: {data.verificationData.identityDocument ? data.verificationData.identityDocument.name : 'Not Uploaded'}</p>
        <p>Business Document: {data.verificationData.businessDocument ? data.verificationData.businessDocument.name : 'Not Uploaded'}</p>
        <p>Additional Comments: {data.verificationData.additionalComments || 'None'}</p>
      </div>

      <button onClick={handleSubmit} className="submit-button">Submit</button>
    </ReviewContainer>
  );
};

export default ReviewAndSubmit;
