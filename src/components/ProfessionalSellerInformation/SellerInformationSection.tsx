import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-bottom: 20px;
`;

const SellerInformationSection: React.FC = () => {
  const sellerInfo = useSelector((state: RootState) => state.registration.sellerInformation);

  return (
    <SectionContainer>
      <h3>Seller Information</h3>
      <p>Company Registration Number: {sellerInfo?.companyRegistrationNumber ?? 'N/A'}</p>
      <p>Business Address: {sellerInfo?.businessAddress ?? 'N/A'}</p>
      <p>Phone Number: {sellerInfo?.phoneNumber ?? 'N/A'}</p>
      <p>Contact First Name: {sellerInfo?.contactPersonFirstName ?? 'N/A'}</p>
      <p>Contact Middle Name: {sellerInfo?.contactPersonMiddleName || 'N/A'}</p>
      <p>Contact Last Name: {sellerInfo?.contactPersonLastName ?? 'N/A'}</p>
      <p>Verification Method: {sellerInfo?.verificationMethod ?? 'N/A'}</p>
      <p>SMS Verification Language: {sellerInfo?.smsVerificationLanguage ?? 'N/A'}</p>
    </SectionContainer>
  );
};

export default SellerInformationSection;
