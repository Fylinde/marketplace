import React from 'react';
import SidebarMenu from '../SidebarMenu/SidebarMenu';

const SecondaryNav: React.FC = () => {
  return (
    <div style={secondaryNavContainer}>
      <div style={menuContainer}>
        <SidebarMenu />
      
        <a href="#" style={navLink}>Today's Deals</a>
        <a href="#" style={navLink}>Buy Again</a>
        <a href="#" style={navLink}>Customer Service</a>
        <a href="#" style={navLink}>Registry</a>
        <a href="#" style={navLink}>Gift Cards</a>
        <a href="#" style={navLink}>Sell</a>
      </div>
      <a href="#" style={specialLink}>Shop the Gaming Store</a>
    </div>
  );
};

const secondaryNavContainer: React.CSSProperties = {
  backgroundColor: '#37475a',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
};

const menuContainer: React.CSSProperties = {
  display: 'flex',
};

const navLink: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  padding: '0 15px',
  fontSize: '14px',
};

const specialLink: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
};

export default SecondaryNav;
