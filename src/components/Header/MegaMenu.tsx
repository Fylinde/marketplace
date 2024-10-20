// MegaMenu.tsx
import React from 'react';
import './MegaMenu.css';

const MegaMenu: React.FC = () => {
  return (
    <div className="mega-menu">
      <ul className="menu-categories">
        <li className="menu-item">
          <a href="#">Category 1</a>
          <div className="submenu">
            <ul>
              <li><a href="#">Subcategory 1-1</a></li>
              <li><a href="#">Subcategory 1-2</a></li>
              <li><a href="#">Subcategory 1-3</a></li>
            </ul>
          </div>
        </li>
        <li className="menu-item">
          <a href="#">Category 2</a>
          <div className="submenu">
            <ul>
              <li><a href="#">Subcategory 2-1</a></li>
              <li><a href="#">Subcategory 2-2</a></li>
              <li><a href="#">Subcategory 2-3</a></li>
            </ul>
          </div>
        </li>
        {/* Repeat similar structure for other categories */}
      </ul>
    </div>
  );
};

export default MegaMenu;
