import React from "react";
import { BillingInformation } from "../../types/sharedTypes"; // Adjust path as needed

interface BillingInformationSectionProps {
  billingInfo: BillingInformation | null; // Accept billingInfo as a prop
}

const BillingInformationSection: React.FC<BillingInformationSectionProps> = ({ billingInfo }) => {
  return (
    <div>
      <h3>Billing Information</h3>
      <p>Credit Card Number: {billingInfo?.creditCardNumber ?? "N/A"}</p>
      <p>Expiry Month: {billingInfo?.expiryMonth ?? "N/A"}</p>
      <p>Expiry Year: {billingInfo?.expiryYear ?? "N/A"}</p>
      <p>Card Holder Name: {billingInfo?.cardHolderName ?? "N/A"}</p>
      <p>Billing Street: {billingInfo?.billingStreet ?? "N/A"}</p>
      <p>Billing City: {billingInfo?.billingCity ?? "N/A"}</p>
      <p>Billing State: {billingInfo?.billingState ?? "N/A"}</p>
      <p>Billing Postal Code: {billingInfo?.billingPostalCode ?? "N/A"}</p>
      <p>Billing Country: {billingInfo?.billingCountry ?? "N/A"}</p>
    </div>
  );
};

export default BillingInformationSection;
