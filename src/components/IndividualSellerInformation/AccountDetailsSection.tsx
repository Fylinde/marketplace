import React from 'react';
import { AccountDetails } from '../../redux/slices/registrationSlice';

interface AccountDetailsSectionProps {
  accountDetails: AccountDetails;
}

const AccountDetailsSection: React.FC<AccountDetailsSectionProps> = ({ accountDetails }) => (
  <div>
    <h3>Account Details</h3>
    <p>Name: {accountDetails.name}</p>
    <p>Email: {accountDetails.email}</p>
  </div>
);

export default AccountDetailsSection;
