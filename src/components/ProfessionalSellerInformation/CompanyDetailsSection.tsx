import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-bottom: 20px;
`;

const CompanyDetailsSection: React.FC = () => {
  const companyDetails = useSelector((state: RootState) => state.registration.companyDetails);

  return (
    <SectionContainer>
      <h3>Company Details</h3>
      <p>Company Name: {companyDetails.companyName}</p>
      <p>Registration Number: {companyDetails.companyRegistrationNumber}</p>
      <p>Tax ID: {companyDetails.taxId}</p>
      <p>Country of Incorporation: {companyDetails.countryOfIncorporation}</p>
      <p>Business Address: {companyDetails.businessAddress}</p>
    </SectionContainer>
  );
};

export default CompanyDetailsSection;
