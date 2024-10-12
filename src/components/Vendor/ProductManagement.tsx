// src/components/Vendor/ProductManagement.tsx

import React, { useState } from 'react';
import './Vendor.css';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Product 1', price: '100', description: 'Description 1' },
    { id: 2, name: 'Product 2', price: '200', description: 'Description 2' },
    // Add more initial products as needed
  ]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to add a new product can be added here
  };

  const handleEditProduct = (id: number) => {
    // Logic to edit a product can be added here
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="product-management">
      <h2>Product Management</h2>
      <div className="add-product">
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct}>
          <input type="text" placeholder="Product Name" required />
          <input type="text" placeholder="Price" required />
          <textarea placeholder="Product Description" required></textarea>
          <input type="file" accept="image/*" required />
          <button type="submit">Add Product</button>
        </form>
      </div>
      <div className="product-list">
        <h3>Your Products</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} <button onClick={() => handleEditProduct(product.id)}>Edit</button> <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
