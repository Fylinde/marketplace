import React from 'react';
import './Header.css';
import Logo from '../Logo/Logo';
import DeliveryOption from '../DeliveryOption/DeliveryOption';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import SearchContainer from '../SearchContainer/SearchContainer';
import LanguageOption from '../LanguageOption/LanguageOption';
import Nav from '../Nav/Nav';
import Cart from '../Cart/Cart';

const Header: React.FC = () => {
  return (
    <div className="header-container">
      <Logo />
      <SidebarMenu />
      <DeliveryOption />
      <SearchContainer />
      <LanguageOption />
      <Nav />
      <Cart />
    </div>
  );
};

export default Header;
