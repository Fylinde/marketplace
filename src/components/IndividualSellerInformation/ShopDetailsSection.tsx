import React from 'react';
import { ShopDetails } from '../../redux/slices/registrationSlice';

interface ShopDetailsSectionProps {
  shopDetails: ShopDetails;
}

const ShopDetailsSection: React.FC<ShopDetailsSectionProps> = ({ shopDetails }) => (
  <div>
    <h3>Shop Details</h3>
    <p>Store Name: {shopDetails.storeName}</p>
    <p>Business Address: {shopDetails.businessAddress}</p>
    <p>Shipping Details: {shopDetails.shippingDetails}</p>
  </div>
);

export default ShopDetailsSection;
