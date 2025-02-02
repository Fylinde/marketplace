import React from "react";
import { StyledFooter } from './StyledFooter'

const Footer = () => {
  return (
    <StyledFooter>
      {/* Top Section */}
      <div className="footer-top">
        {/* Column 1 */}
        <div className="column">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/press">Press</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="column">
          <h4>Support</h4>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/returns">Returns</a></li>
            <li><a href="/shipping">Shipping</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="column">
          <h4>Shop</h4>
          <ul>
            <li><a href="/categories/electronics">Electronics</a></li>
            <li><a href="/categories/fashion">Fashion</a></li>
            <li><a href="/categories/home">Home & Garden</a></li>
            <li><a href="/categories/sports">Sports & Outdoors</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="column">
          <h4>Stay Connected</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="footer-middle">
        <div className="newsletter">
          <h4>Subscribe to our Newsletter</h4>
          <form>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FyLinde. All rights reserved.</p>
        <ul>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
          <li><a href="/cookies">Cookies</a></li>
        </ul>
      </div>
    </StyledFooter>
  );
};

export default Footer;
