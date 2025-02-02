import React from 'react';
import HeroSection from './HeroSection';
import CategoryHighlights from './CategoryHighlights';
import FeaturedSellers from './FeaturedSellers';

const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <HeroSection />
      <CategoryHighlights />
      <FeaturedSellers />
      {/* Add more components as needed */}
    </main>
  );
};

export default MainContent;
