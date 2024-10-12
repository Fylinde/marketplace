import React from 'react';
import VendorStorefront from '../components/Vendor/VendorStorefront';
import { useParams } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Vendor {
  name: string;
  description: string;
  products: Product[];
}

const VendorStorefrontPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Assuming the vendor id is passed as a URL parameter

  const vendor: Vendor = {
    name: 'Vendor Name',
    description: 'Vendor Description',
    products: [
      { id: 1, name: 'Product 1', price: 99.99, image: '/path/to/image1.jpg' },
      { id: 2, name: 'Product 2', price: 79.99, image: '/path/to/image2.jpg' },
    ],
  };

  return <VendorStorefront vendor={vendor} />;
};

export default VendorStorefrontPage;
