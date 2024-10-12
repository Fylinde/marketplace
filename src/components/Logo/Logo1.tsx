import React from 'react';
import './Logo.css';
import { useNavigate } from 'react-router-dom';

const Logo: React.FC = () => {
  const navigate = useNavigate(); // Move useNavigate inside the component

  const handleLogoClick = () => {
    navigate('/'); // Redirect to the homepage
  };

  return (
    <div className="logo">
      <div className="nav-logo" onClick={handleLogoClick}>
        <img
          src="Logo/fylind_logo.png"
          alt="Fylinde"
        />
      </div>
    </div>
  );
};

export default Logo;
