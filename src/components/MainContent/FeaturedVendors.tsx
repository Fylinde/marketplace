import React from 'react';
import './FeaturedVendors.css';

const FeaturedVendors: React.FC = () => (
  <section className="featured-vendors">
    <h2>Featured Vendors</h2>
    <div className="vendors-scroll">
      <div className="vendor-card">
        <img src="path/to/vendor1.jpg" alt="Vendor 1" />
        <p>Vendor Name 1</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor2.jpg" alt="Vendor 2" />
        <p>Vendor Name 2</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 3</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 4</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 5</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 6</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 7</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 8</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 9</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 10</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 11</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 12</p>
      </div>
      <div className="vendor-card">
        <img src="path/to/vendor3.jpg" alt="Vendor 3" />
        <p>Vendor Name 13</p>
      </div>
      {/* Add more vendors as needed */}
    </div>
  </section>
);

export default FeaturedVendors;
