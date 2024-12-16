import React from 'react';
import { ContactDetails } from '../../types/sharedTypes';

interface ContactDetailsSectionProps {
  contactDetails: ContactDetails;
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({ contactDetails }) => (
  <div>
    <h3>Contact Details</h3>
    <p>First Name: {contactDetails.firstName}</p>
    <p>Last Name: {contactDetails.lastName}</p>
    <p>Residential Address: {contactDetails.residentialAddress}</p>
    <p>Phone Number: {contactDetails.phoneNumber}</p>
  </div>
);

export default ContactDetailsSection;
