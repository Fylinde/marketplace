import React from 'react';
import { PaymentDetails } from '../../types/sharedTypes';

interface PaymentDetailsSectionProps {
  paymentDetails: PaymentDetails;
}

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({ paymentDetails }) => (
  <div>
    <h3>Payment Details</h3>
    <p>Cardholder Name: {paymentDetails.cardholderName}</p>
    <p>Expiry Date: {paymentDetails.expiryDate.month}/{paymentDetails.expiryDate.year}</p>
  </div>
);

export default PaymentDetailsSection;
