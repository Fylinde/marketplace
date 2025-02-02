import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-bottom: 20px;
`;

const BusinessInformationSection: React.FC = () => {
  const businessInfo = useSelector((state: RootState) => state.registration.businessInformation);

  return (
    <SectionContainer>
      <h3>Business Information</h3>
      <p>Business Location: {businessInfo?.businessLocation ?? 'N/A'}</p>
      <p>Business Type: {businessInfo?.businessType ?? 'N/A'}</p>
      <p>Business Name: {businessInfo?.businessName ?? 'N/A'}</p>
    </SectionContainer>
  );
};

export default BusinessInformationSection;
