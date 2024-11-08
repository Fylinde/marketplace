import React from 'react';
import { CompanyDetails } from '../../redux/slices/registrationSlice';

interface CompanyDetailsSectionProps {
  companyDetails: CompanyDetails;
}

const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({ companyDetails }) => (
  <div>
    <h3>Company Details</h3>
    <p>Company Name: {companyDetails.companyName}</p>
    <p>Country: {companyDetails.country}</p>
    <p>Company Type: {companyDetails.companyType}</p>
    <p>First Name: {companyDetails.firstName}</p>
    <p>Last Name: {companyDetails.lastName}</p>
  </div>
);

export default CompanyDetailsSection;
