import React from 'react';
import './FeaturedSellers.css';

const FeaturedSellers: React.FC = () => (
  <section className="featured-sellers">
    <h2>Featured Sellers</h2>
    <div className="sellers-scroll">
      <div className="seller-card">
        <img src="path/to/seller1.jpg" alt="Seller 1" />
        <p>Seller Name 1</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller2.jpg" alt="Seller 2" />
        <p>Seller Name 2</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 3</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 4</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 5</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 6</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 7</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 8</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 9</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 10</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 11</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 12</p>
      </div>
      <div className="seller-card">
        <img src="path/to/seller3.jpg" alt="Seller 3" />
        <p>Seller Name 13</p>
      </div>
      {/* Add more sellers as needed */}
    </div>
  </section>
);

export default FeaturedSellers;
