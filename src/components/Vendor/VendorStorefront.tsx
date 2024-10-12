// src/components/Vendor/VendorStorefront.tsx

import React from 'react';
import './Vendor.css';

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

interface VendorStorefrontProps {
  vendor: Vendor;
}

const VendorStorefront: React.FC<VendorStorefrontProps> = ({ vendor }) => {
  return (
    <div className="vendor-storefront">
      <h2>{vendor.name}'s Store</h2>
      <p>{vendor.description}</p>
      <div className="vendor-products">
        {vendor.products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorStorefront;
