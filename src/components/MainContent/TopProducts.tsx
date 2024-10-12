import React from 'react';
import './TopProducts.css';

const TopProducts: React.FC = () => (
  <section className="top-products">
    <h2>Top Products</h2>
    <div className="products-scroll">
      <div className="product-card">
        <img src="path/to/product1.jpg" alt="Product 1" />
        <p>Product Name 1</p>
        <p>$99.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product2.jpg" alt="Product 2" />
        <p>Product Name 2</p>
        <p>$79.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 3</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 4</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 5</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 6</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 7</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 8</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 9</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 10</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 11</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 12</p>
        <p>$199.99</p>
      </div>
      <div className="product-card">
        <img src="path/to/product3.jpg" alt="Product 3" />
        <p>Product Name 13</p>
        <p>$199.99</p>
      </div>
      {/* Add more products as needed */}
    </div>
  </section>
);

export default TopProducts;
