import React from 'react';
import HeroSection from '../components/MainContent/HeroSection';
import CategoryHighlights from '../components/MainContent/CategoryHighlights';
import TopProducts from '../components/MainContent/TopProducts';
import FeaturedVendors from '../components/MainContent/FeaturedVendors';
import UserRecommendations from '../components/MainContent/UserRecommendations';
import './HomePage.css';

const HomePage: React.FC = () => (
  <div className="home-page">
    <HeroSection />
    <CategoryHighlights />
    <TopProducts />
    <FeaturedVendors />
    <UserRecommendations />
  </div>
);

export default HomePage;
