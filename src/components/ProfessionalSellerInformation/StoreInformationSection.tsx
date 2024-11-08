import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-bottom: 20px;
`;

const StoreInformationSection: React.FC = () => {
  const storeInfo = useSelector((state: RootState) => state.registration.storeInformation);

  return (
    <SectionContainer>
      <h3>Store Information</h3>
      <p>Store Name: {storeInfo?.storeName ?? 'N/A'}</p>
      <p>UPC: {storeInfo?.upc ?? 'N/A'}</p>
      <p>Manufacturer Brand Owner: {storeInfo?.manufacturerBrandOwner ?? 'N/A'}</p>
      <p>Trademark Ownership: {storeInfo?.trademarkOwnership ?? 'N/A'}</p>
    </SectionContainer>
  );
};

export default StoreInformationSection;
