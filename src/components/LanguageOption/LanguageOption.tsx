import React, { useState } from 'react';

const LanguageOption: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={langContainer} onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
      <div style={langStyle}>
        <img src="https://via.placeholder.com/20x10?text=EN" alt="EN" style={langImg} />
        <span>EN</span>
      </div>
      {isOpen && (
        <div style={dropdownMenu}>
          <a href="#" style={dropdownLink}>English -EN</a>
          <a href="#" style={dropdownLink}>español - ES</a>
          <a href="#" style={dropdownLink}>French - FN</a>
          <a href="#" style={dropdownLink}>العربية - AR</a>
          <a href="#" style={dropdownLink}>Deutsch - DE</a>
          <a href="#" style={dropdownLink}>עברית - HE</a>
          <a href="#" style={dropdownLink}>português - PT</a>
          <a href="#" style={dropdownLink}>中文(简体) - ZH</a>
          <a href="#" style={dropdownLink}>French</a>
        </div>
      )}
    </div>
  );
};

const langContainer: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  marginRight: '20px',
};

const langStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  border: '1px solid transparent',  // Initial border
  borderRadius: '4px',
  transition: 'border 0.3s ease',
};

// Dropdown Menu for Language
const dropdownMenu: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  backgroundColor: 'white',
  border: '1px solid #ccc',
  padding: '10px',
  zIndex: 1000 ,
};

// Dropdown links
const dropdownLink: React.CSSProperties = {
  display: 'block',
  color: '#333',
  padding: '5px 10px',
  textDecoration: 'none',
};

const langImg: React.CSSProperties = {
  height: '14px',
  marginRight: '5px',
};

export default LanguageOption;
