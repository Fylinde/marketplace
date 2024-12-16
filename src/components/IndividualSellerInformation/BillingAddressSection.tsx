import React from 'react';
import { BillingAddress } from '../../types/sharedTypes';


interface BillingAddressSectionProps {
  billingAddress: BillingAddress;
}

const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({ billingAddress }) => (
  <div>
    <h3>Billing Address</h3>
    <p>Street: {billingAddress.street}</p>
    <p>City: {billingAddress.city}</p>
    <p>Postal Code: {billingAddress.postal_code}</p>
  </div>
);

export default BillingAddressSection;
