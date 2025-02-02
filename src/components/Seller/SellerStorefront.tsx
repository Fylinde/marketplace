// src/components/Seller/SellerStorefront.tsx

import React from 'react';
import './Seller.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Seller {
  name: string;
  description: string;
  products: Product[];
}

interface SellerStorefrontProps {
  seller: Seller;
}

const SellerStorefront: React.FC<SellerStorefrontProps> = ({ seller }) => {
  return (
    <div className="seller-storefront">
      <h2>{seller.name}'s Store</h2>
      <p>{seller.description}</p>
      <div className="seller-products">
        {seller.products.map(product => (
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

export default SellerStorefront;
