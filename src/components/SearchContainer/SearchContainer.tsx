import React, { useState } from 'react';

const SearchContainer: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div style={searchContainer}>
      <select style={selectStyle} onClick={toggleDropdown}>
        <option>All</option>
        {isDropdownOpen && (
          <ul style={dropdownMenu}>
            <li>All Departments</li>
            <li>Arts & Crafts</li>
            <li>Automotive</li>
            <li>Baby</li>
            <li>Beauty & Personal Care</li>
            <li>Books</li>
            <li>Boys' Fashion</li>
            <li>Computers</li>
            <li>Deals</li>
            <li>Digital Music</li>
            <li>Electronics</li>
            <li>Girls' Fashion</li>
            <li>Health & Household</li>
            <li>Home & Kitchen</li>
            <li>Industrial & Scientific</li>
            <li>Kindle Store</li>
            <li>Luggage</li>
            <li>Men's Fashion</li>
            <li>Movies & TV</li>
            <li>Music, CDs & Vinyl</li>
            <li>Pet Supplies</li>
            <li>Prime Video</li>
            <li>Software</li>
            <li>Sports & Outdoors</li>
            <li>Tools & Home Improvement</li>
            <li>Toys & Games</li>
            <li>Video Games</li>
            <li>Women's Fashion</li>
          </ul>
        )}
      </select>
      <input type="text" placeholder="Search Mysite" style={inputStyle} />
      <button style={buttonStyle}>
        <img src="https://via.placeholder.com/16x16?text=S" alt="Search" />
      </button>
    </div>
  );
};

const searchContainer: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  margin: '0 20px',
};

const selectStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px 0 0 4px',
  backgroundColor: '#f3f3f3',
  width: '80px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderLeft: 'none',
  borderRadius: '0',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#febd69',
  border: 'none',
  padding: '10px 15px',
  cursor: 'pointer',
  borderRadius: '0 4px 4px 0',
};

const dropdownMenu: React.CSSProperties = {
  listStyleType: 'none',
  padding: '10px',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  maxHeight: '300px',
  overflowY: 'auto',
};

export default SearchContainer;
