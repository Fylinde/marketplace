import React, { useState } from 'react';
import './LanguageOption.css';

const LanguageOption: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="language-option" onClick={toggleDropdown}>

      <span>EN</span>
      {isDropdownOpen && (
        <div className="language-dropdown">
          <h4>Change language</h4>
          <p>English - EN</p>
          <p>español - ES</p>
          <p>العربية - AR</p>
          <p>Deutsch - DE</p>
          <p>עברית - HE</p>
          <p>한국어 - KO</p>
          <p>português - PT</p>
          <p>中文(简体) - ZH</p>
          <p>中文(繁體) - ZH</p>
          <hr />
          <h4>Change currency</h4>
          <p>$ - USD - US Dollar <a href="#">Change</a></p>
        </div>
      )}
    </div>
  );
};

export default LanguageOption;
