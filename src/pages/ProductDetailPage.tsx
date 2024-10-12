import React from 'react';
import ImageGallery from 'react-image-gallery';
import './ProductDetailPage.css';

interface Image {
  original: string;
  thumbnail: string;
}

const ProductDetailPage: React.FC = () => {
  const images: Image[] = [
    {
      original: 'path/to/image1.jpg',
      thumbnail: 'path/to/thumb1.jpg',
    },
    {
      original: 'path/to/image2.jpg',
      thumbnail: 'path/to/thumb2.jpg',
    },
    {
      original: 'path/to/image3.jpg',
      thumbnail: 'path/to/thumb3.jpg',
    },
    // Add more images as needed
  ];

  return (
    <div className="product-detail">
      <ImageGallery items={images} />
      <div className="product-info">
        <h1>Nike Cortez Low Men's Shoes</h1>
        <p>Price: $107.09</p>
        <p>Condition: Pre-owned, Good Condition</p>
        <button className="buy-now-button">Buy It Now</button>
        <button className="add-to-cart-button">Add to Cart</button>
        <button className="make-offer-button">Make Offer</button>
        
        <div className="contact-seller">
          <h4>Contact Seller</h4>
          <button className="chat-button">Chat with Seller</button>
          <button className="whatsapp-button">WhatsApp</button>
          <button className="call-button">Call Seller</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
