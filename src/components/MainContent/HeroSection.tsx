import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <Carousel 
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        interval={5000}
      >
        <div className="carousel-slide" style={{ backgroundColor: '#ffc107' }}>
          <div className="carousel-content">
            <h2>Real heat. Under $200.</h2>
            <p>Shop ASICS, Fear of God, Aimé Leon Dore, and more.</p>
            <button className="carousel-button">Dive in</button>
          </div>
          <img src="path/to/image1.jpg" alt="Promotion 1" />
        </div>
        <div className="carousel-slide" style={{ backgroundColor: '#007185' }}>
          <div className="carousel-content">
            <h2>Discover the Latest Electronics</h2>
            <p>Top brands at unbeatable prices.</p>
            <button className="carousel-button">Shop now</button>
          </div>
          <img src="path/to/image2.jpg" alt="Promotion 2" />
        </div>
        {/* Add more slides as needed */}
      </Carousel>
    </section>
  );
};

export default HeroSection;
