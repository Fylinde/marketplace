import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-back-to-top">
        <a href="#top">Back to top</a>
      </div>
      <div className="footer-links">
        <div className="footer-column">
          <h3>Get to Know Us</h3>
          <ul>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">About Fylinde</a></li>
            <li><a href="#">Investor Relations</a></li>
            <li><a href="#">Fylinde Devices</a></li>
            <li><a href="#">Fylinde Science</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Make Money with Us</h3>
          <ul>
            <li><a href="#">Sell products on Fylinde</a></li>
            <li><a href="#">Sell on Fylinde Business</a></li>
            <li><a href="#">Sell apps on Fylinde</a></li>
            <li><a href="#">Become an Affiliate</a></li>
            <li><a href="#">Advertise Your Products</a></li>
            <li><a href="#">Self-Publish with Us</a></li>
            <li><a href="#">Host an Fylinde Hub</a></li>
            <li><a href="#">See More Make Money with Us</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Fylinde Payment Products</h3>
          <ul>
            <li><a href="#">Fylinde Business Card</a></li>
            <li><a href="#">Shop with Points</a></li>
            <li><a href="#">Reload Your Balance</a></li>
            <li><a href="#">Fylinde Currency Converter</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Let Us Help You</h3>
          <ul>
            <li><a href="#">Fylinde and COVID-19</a></li>
            <li><a href="#">Your Account</a></li>
            <li><a href="#">Your Orders</a></li>
            <li><a href="#">Shipping Rates & Policies</a></li>
            <li><a href="#">Returns & Replacements</a></li>
            <li><a href="#">Manage Your Content and Devices</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
        </div>
        <div className="footer-bottom-options">
          <select>
            <option>English</option>
           
          </select>
          <select>
            <option>USD - U.S. Dollar</option>
          
          </select>
          <select>
            <option>United States</option>
          
          </select>
        </div>
      </div>
      <div className="footer-legal">
        <ul>
          <li><a href="#">Conditions of Use</a></li>
          <li><a href="#">Privacy Notice</a></li>
          <li><a href="#">Interest-Based Ads</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
