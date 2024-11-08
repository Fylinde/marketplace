import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/register/seller/individual/company-details');
  };

  return (
    <div className="welcome-container">
      <header className="header">
        <h1>Fylinde Seller Central</h1>
      </header>
      <main className="welcome-content">
        <div className="welcome-info">
          <h1 className="welcome-title">Welcome. This is what you can expect</h1>
          <ol className="steps-list">
            <li>
              <h3>Provide your details and documents</h3>
              <p>We need to collect relevant personal and business data to comply with identification and verification measures. We may need additional information or documents later.</p>
            </li>
            <li>
              <h3>We are verifying your submission</h3>
              <p>You may be asked to schedule an appointment with a Fylinde associate to verify your submission. This will help Fylinde remain a trusted shopping destination.</p>
            </li>
            <li>
              <h3>Get verified and start selling.</h3>
              <p>After we receive all the necessary information, it will be verified as soon as possible.</p>
            </li>
          </ol>
          <button className="start-button" onClick={handleStart}>Start</button>
        </div>
        <aside className="supplies-info">
          <h3>Supplies:</h3>
          <ul>
            <li>✔️ Valid government issued ID or passport</li>
            <li>✔️ Recent bank account or credit card statement</li>
            <li>✔️ Rechargeable credit or debit card</li>
            <li>✔️ Mobile phone</li>
          </ul>
        </aside>
      </main>
      <footer className="footer">
        <select>
          <option value="en">English</option>
          <option value="nl">Dutch</option>
          {/* Add more languages as needed */}
        </select>
        <p>© 1996-2024, Fylinde.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
