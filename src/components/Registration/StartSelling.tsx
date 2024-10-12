import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartSelling.css';

const StartSelling: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Perform any necessary logic before starting
    navigate('/create-seller-account'); // Navigate to create seller account page
  };

  return (
    <div className="start-selling-container">
      <h1>Start Selling on Fylinde</h1>
      <button onClick={handleStart} className="start-selling-button">
        Get Started
      </button>
    </div>
  );
};

export default StartSelling;
