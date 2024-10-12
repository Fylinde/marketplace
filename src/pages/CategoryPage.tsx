import React from 'react';
import './CategoryPage.css';

const CategoryPage: React.FC = () => (
  <div className="category-page">
    <aside className="category-filters">
      <h3>Filters</h3>
      <div className="filter-group">
        <h4>Price</h4>
        <input type="range" min="0" max="1000" step="10" />
      </div>
      <div className="filter-group">
        <h4>Brand</h4>
        <label><input type="checkbox" /> Levi's</label>
        <label><input type="checkbox" /> Fylinde Essentials</label>
        <label><input type="checkbox" /> Wrangler</label>
        {/* Add more brand filters as needed */}
      </div>
      {/* Add more filter groups as needed */}
    </aside>
    <div className="category-products">
      {/* Render the products here */}
    </div>
  </div>
);

export default CategoryPage;
