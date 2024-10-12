import React from 'react';
import './CategoryHighlights.css';

const CategoryHighlights: React.FC = () => (
  <section className="category-highlights">
    <h2>Shop by Category</h2>
    <div className="categories-scroll">
      <div className="category-card">
        <img src="path/to/electronics.jpg" alt="Electronics" />
        <p>Electronics</p>
      </div>
      <div className="category-card">
        <img src="path/to/fashion.jpg" alt="Fashion" />
        <p>Fashion</p>
      </div>
      <div className="category-card">
        <img src="path/to/home.jpg" alt="Home" />
        <p>Home</p>
      </div>
      <div className="category-card">
        <img src="path/to/phone.jpg" alt="Phone" />
        <p>Phone</p>
      </div>
      <div className="category-card">
        <img src="path/to/food.jpg" alt="Food" />
        <p>Food</p>
      </div>
      <div className="category-card">
        <img src="path/to/drinks.jpg" alt="Drinks" />
        <p>Drinks</p>
      </div>
      <div className="category-card">
        <img src="path/to/water.jpg" alt="Water" />
        <p>Water</p>
      </div>
      <div className="category-card">
        <img src="path/to/real.jpg" alt="Real" />
        <p>Real</p>
      </div>
      <div className="category-card">
        <img src="path/to/can.jpg" alt="Can" />
        <p>Can</p>
      </div>
      <div className="category-card">
        <img src="path/to/bear.jpg" alt="Bear" />
        <p>Bear</p>
      </div>
      <div className="category-card">
        <img src="path/to/toy.jpg" alt="Toy" />
        <p>Toy</p>
      </div>
      <div className="category-card">
        <img src="path/to/Chair.jpg" alt="Chair" />
        <p>Chair</p>
      </div>
      <div className="category-card">
        <img src="path/to/humans.jpg" alt="Humans" />
        <p>Humans</p>
      </div>
      {/* Add more categories as needed */}
    </div>
  </section>
);

export default CategoryHighlights;
