import React from 'react';
import { useNavigate } from 'react-router-dom';


const Logo: React.FC = () => {
  const navigate = useNavigate(); // Move useNavigate inside the component

  const handleLogoClick = () => {
    navigate('/'); // Redirect to the homepage
  };

  return (
    <div style={logoContainer} onClick={handleLogoClick}>
      <img
          src="Logo/fylind_logo.png"
          alt="Fylinde"
        style={logoStyle}
      />
    </div>
  );
};

const logoContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const logoStyle: React.CSSProperties = {
  height: '40px',
};

export default Logo;
