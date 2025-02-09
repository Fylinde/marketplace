import React from 'react';

import { AccountDetails } from '../../types/sharedTypes';

interface AccountDetailsSectionProps {
  accountDetails: AccountDetails;
}

const AccountDetailsSection: React.FC<AccountDetailsSectionProps> = ({ accountDetails }) => (
  <div>
    <h3>Account Details</h3>
    <p>Name: {accountDetails.full_name}</p>
    <p>Email: {accountDetails.email}</p>
  </div>
);

export default AccountDetailsSection;
