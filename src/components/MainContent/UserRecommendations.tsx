import React from 'react';
import './UserRecommendations.css';

interface UserRecommendationsProps {
  onNext?: () => void; // Make the prop optional
}

const UserRecommendations: React.FC<UserRecommendationsProps> = () => (
  <section className="user-recommendations">
    <h2>Recommended for You</h2>
    <div className="recommendations-scroll">
      <div className="recommendation-card">
        <img src="/assets/product1.jpg" alt="Product 1" />
        <p>Product Name 1</p>
        <p>$99.99</p>
      </div>
      {/* Add more recommendation cards as needed */}
    </div>
  </section>
);

export default UserRecommendations;
