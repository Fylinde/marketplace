import React, { useState } from 'react';
import './SearchContainer.css';

const SearchContainer: React.FC = () => {
  const [isSearchDropdownOpen, setSearchDropdownOpen] = useState(false);

  return (
    <div className="search-container">
      <div className="search-dropdown-trigger" onClick={() => setSearchDropdownOpen(!isSearchDropdownOpen)}>
        <span>All ▾</span>
        {isSearchDropdownOpen && (
          <div className="search-dropdown">
            <p>All Departments</p>
            <p>Arts & Crafts</p>
            <p>Automotive</p>
            <p>Baby</p>
            <p>Beauty & Personal Care</p>
            <p>Books</p>
            <p>Boys' Fashion</p>
            <p>Computers</p>
          </div>
        )}
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search Fylinde" />
        <button>Search</button>
      </div>
    </div>
  );
};

export default SearchContainer;
