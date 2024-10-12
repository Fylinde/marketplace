import React from 'react';
import HeroSection from './HeroSection';
import CategoryHighlights from './CategoryHighlights';
import FeaturedVendors from './FeaturedVendors';

const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <HeroSection />
      <CategoryHighlights />
      <FeaturedVendors />
      {/* Add more components as needed */}
    </main>
  );
};

export default MainContent;
