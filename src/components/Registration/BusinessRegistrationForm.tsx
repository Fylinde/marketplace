import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import AccountDetailsSection from "../IndividualSellerInformation/AccountDetailsSection";
import ContactDetailsSection from "../IndividualSellerInformation/ContactDetailsSection";
import PaymentDetailsSection from "../IndividualSellerInformation/PaymentDetailsSection";
import ShopDetailsSection from "../IndividualSellerInformation/ShopDetailsSection";
import VerificationDetailsSection from "../IndividualSellerInformation/VerificationDetailsSection";
import BillingAddressSection from "../IndividualSellerInformation/BillingAddressSection";
import { BillingAddress, PaymentDetails } from "../../types/sharedTypes";

const BusinessRegistrationForm: React.FC = () => {
  // Fetch data from Redux store
  const accountDetails = useSelector((state: RootState) => state.registration.accountDetails);
  const contactDetails = useSelector((state: RootState) => state.registration.contactDetails);
  const paymentDetails = useSelector((state: RootState) => state.registration.paymentDetails);
  const shopDetails = useSelector((state: RootState) => state.registration.shopDetails);
  const verificationDetails = useSelector(
    (state: RootState) =>
      state.registration.verificationDetails || { identityDocument: null, businessDocument: null }
  );
  const billingAddress = useSelector((state: RootState) => state.registration.billingAddress);

  // Provide default values for missing fields in paymentDetails
  const completePaymentDetails: PaymentDetails = {
    cardNumber: paymentDetails.cardNumber || "",
    cardholderName: paymentDetails.cardholderName || "",
    expiryDate: {
      month: paymentDetails.expiryDate?.month || "1",
      year: paymentDetails.expiryDate?.year || new Date().getFullYear().toString(),
    },
    cvv: paymentDetails.cvv || "",
    currency: paymentDetails.currency || "USD",
  };

  // Provide default values for missing fields in billingAddress
  const completeBillingAddress: BillingAddress = {
    fullName: billingAddress.fullName || "",
    email: billingAddress.email || "",
    phoneNumber: billingAddress.phoneNumber || "",
    addressLine1: billingAddress.addressLine1 || "",
    addressLine2: billingAddress.addressLine2 || "",
    city: billingAddress.city || "",
    state: billingAddress.state || "",
    postalCode: billingAddress.postalCode || "",
    country: billingAddress.country || "",
    street: billingAddress.street || "",
  };

  return (
    <div>
      <h2>Review Your Information</h2>

      <AccountDetailsSection accountDetails={accountDetails} />
      <ContactDetailsSection contactDetails={contactDetails} />
      <PaymentDetailsSection paymentDetails={completePaymentDetails} />
      <ShopDetailsSection shopDetails={shopDetails} />
      <VerificationDetailsSection verificationDetails={verificationDetails} />
      <BillingAddressSection billingAddress={completeBillingAddress} />
    </div>
  );
};

export default BusinessRegistrationForm;
