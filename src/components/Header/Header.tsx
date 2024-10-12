import React from 'react';
import Logo from '../Logo/Logo';
import DeliveryOption from '../DeliveryOption/DeliveryOption';
import SearchContainer from '../SearchContainer/SearchContainer';
import LanguageOption from '../LanguageOption/LanguageOption';
import Nav from '../Nav/Nav1';
import Cart from '../Cart/Cart';
import SecondaryNav from '../SecondaryNav/SecondaryNav'; // Import the secondary nav

const Header: React.FC = () => {
  return (
    <>
      {/* Main header */}
      <div className="header-container" style={headerContainer}>
        <Logo />
        <DeliveryOption />
        <SearchContainer />
        <LanguageOption />
        <Nav />
        <Cart />
      </div>

      {/* Secondary navigation bar */}
      <SecondaryNav /> {/* Import and render the SecondaryNav component here */}
    </>
  );
};

// Styles for the main header
const headerContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#232f3e',
  color: 'white',
};

export default Header;
