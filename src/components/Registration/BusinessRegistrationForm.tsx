import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AccountDetailsSection from '../IndividualSellerInformation/AccountDetailsSection';
import ContactDetailsSection from '../IndividualSellerInformation/ContactDetailsSection';
import PaymentDetailsSection from '../IndividualSellerInformation/PaymentDetailsSection';
import ShopDetailsSection from '../IndividualSellerInformation/ShopDetailsSection';
import VerificationDetailsSection from '../IndividualSellerInformation/VerificationDetailsSection';
import BillingAddressSection from '../IndividualSellerInformation/BillingAddressSection';

const BusinessRegistrationForm: React.FC = () => {
  // Fetch data from Redux store
  const accountDetails = useSelector((state: RootState) => state.registration.accountDetails);
  const contactDetails = useSelector((state: RootState) => state.registration.contactDetails);
  const paymentDetails = useSelector((state: RootState) => state.registration.paymentDetails);
  const shopDetails = useSelector((state: RootState) => state.registration.shopDetails);
  const verificationDetails = useSelector((state: RootState) => state.registration.verificationDetails);
  const billingAddress = useSelector((state: RootState) => state.registration.billingAddress);

  return (
    <div>
      <h2>Review Your Information</h2>

      <AccountDetailsSection accountDetails={accountDetails} />
      <ContactDetailsSection contactDetails={contactDetails} />
      <PaymentDetailsSection paymentDetails={paymentDetails} />
      <ShopDetailsSection shopDetails={shopDetails} />
      <VerificationDetailsSection verificationDetails={verificationDetails} />
      <BillingAddressSection billingAddress={billingAddress} />
    </div>
  );
};

export default BusinessRegistrationForm;
