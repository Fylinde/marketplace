import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  ReviewContainer,
  SectionTitle,
  SectionContent,
  DocumentLink,
  SubmitButton,
} from "./ReviewAndSubmitStyled";
import { FileMetadata } from "../../types/sharedTypes";
import { convertFileMetadataToFile } from "../../utils/convertFileMetadataToFile ";


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
        postalCode: string;
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
      identityDocument: FileMetadata | null;
      businessDocument: FileMetadata | null;
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
    sellerType: "individual" | "professional";
  };
  onSubmit: () => void;
}

const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({ data, onSubmit }) => {
  const sellerType = useSelector((state: RootState) => state.registration.sellerType);

  const handleFilePreview = (fileMetadata: FileMetadata | null) => {
    if (fileMetadata) {
      const file = convertFileMetadataToFile(fileMetadata);
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    }
  };

  const renderSection = (title: string, content: JSX.Element) => (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <SectionContent>{content}</SectionContent>
    </div>
  );

  const handleSubmit = async () => {
    try {
      // Submit logic as in the original code
      const response = await axios.post("/endpoint", data); // Placeholder
      if (response.status === 201) {
        onSubmit();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <ReviewContainer>
      <h2>Review Your Information</h2>

      {/* Account Details */}
      {renderSection(
        "Account Details",
        <>
          <p>Full Name: {data.accountDetailsData.full_name}</p>
          <p>Email: {data.accountDetailsData.email}</p>
        </>
      )}

      {/* Contact Details */}
      {renderSection(
        "Contact Details",
        <>
          <p>First Name: {data.contactDetailsData.firstName}</p>
          <p>Last Name: {data.contactDetailsData.lastName}</p>
          <p>Phone Number: {data.contactDetailsData.phoneNumber}</p>
          <p>Address: {data.contactDetailsData.residentialAddress}</p>
        </>
      )}

      {/* Payment Details */}
      {renderSection(
        "Payment Details",
        <>
          <p>Cardholder Name: {data.paymentDetails.cardholderName}</p>
          <p>Billing Address: {data.paymentDetails.billingAddress.street}, {data.paymentDetails.billingAddress.city}</p>
        </>
      )}

      {/* Shop Setup Data */}
      {renderSection(
        "Shop Details",
        <>
          <p>Store Name: {data.shopSetupData.storeName}</p>
          <p>Categories: {data.shopSetupData.productCategories.join(", ")}</p>
        </>
      )}

      {/* Verification Documents */}
      {renderSection(
        "Verification Documents",
        <>
          {data.verificationData.identityDocument && (
            <DocumentLink onClick={() => handleFilePreview(data.verificationData.identityDocument)}>
              View Identity Document
            </DocumentLink>
          )}
          {data.verificationData.businessDocument && (
            <DocumentLink onClick={() => handleFilePreview(data.verificationData.businessDocument)}>
              View Business Document
            </DocumentLink>
          )}
        </>
      )}

      {/* Professional Seller Details */}
      {sellerType === "professional" &&
        renderSection(
          "Company Details",
          <>
            <p>Company Name: {data.companyDetails?.companyName}</p>
            <p>Registration Number: {data.companyDetails?.companyRegistrationNumber}</p>
          </>
        )}

      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </ReviewContainer>
  );
};

export default ReviewAndSubmit;
