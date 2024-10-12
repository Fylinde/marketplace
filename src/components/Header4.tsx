import React, { useState } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #131921;
  padding: 10px 20px;
  color: white;
  position: relative;
`;

const Logo = styled.div`
  img {
    width: 100px;
    object-fit: contain;
    margin-right: 20px;
  }
`;

const DeliveryOption = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;

  span {
    font-size: 10px;
  }

  span:nth-child(2) {
    font-size: 13px;
    font-weight: 800;
  }
`;

const SidebarMenu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
`;

const SidebarDropdown = styled.div`
  display: none;
  position: absolute;
  left: 0;
  top: 50px;
  background-color: white;
  color: black;
  width: 350px;
  border: 1px solid #ccc;
  z-index: 100;
  padding: 10px;

  ${SidebarMenu}:hover & {
    display: block;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  margin-left: 10px;
`;

const SearchDropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  background-color: #f3f3f3;
  padding: 8px 10px;
  cursor: pointer;
  border-right: 1px solid #ccc; /* Border to separate from the search bar */
`;

const SearchBar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  input {
    height: 25px; /* Adjusted height for alignment */
    padding: 10px;
    border: 1px solid #ccc; /* Border added for the input */
    width: 100%;
    border-left: none; /* Remove left border to merge with dropdown */
  }

  button {
    height: 38px; /* Same height as input for alignment */
    background-color: #febd69;
    border: none;
    padding: 0 20px;
    cursor: pointer;
  }
`;

const SearchDropdown = styled.div`
  display: none;
  position: absolute;
  top: 38px;
  left: 0;
  background-color: white;
  color: black;
  width: 240px;
  border: 1px solid #ccc;
  z-index: 100;

  ${SearchDropdownTrigger}:hover & {
    display: block;
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const NavOption = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  position: relative;

  span {
    font-size: 10px;
  }

  span:nth-child(2) {
    font-size: 13px;
    font-weight: 800;
  }

  &:hover .dropdown-content {
    display: block;
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: white;
  min-width: 350px;
  border: 1px solid #ccc;
  z-index: 1;
  color: black;
  top: 40px;
  right: 0;
  padding: 10px;
`;

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
  position: relative;

  img {
    width: 20px;
    margin-right: 5px;
  }
`;

const LanguageDropdown = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: white;
  color: black;
  width: 300px;
  border: 1px solid #ccc;
  z-index: 100;
  top: 38px;
  right: 0;
`;

const Cart = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;

  span {
    margin-left: 10px;
    font-weight: 800;
  }
`;

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <HeaderContainer>
      <Logo>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon"
        />
      </Logo>

      <SidebarMenu onClick={() => setSidebarOpen(!isSidebarOpen)}>
        <span>☰ All</span>
        {isSidebarOpen && (
          <SidebarDropdown>
            <p><strong>Hello, Olisa</strong></p>
            <hr />
            <h4>Digital Content & Devices</h4>
            <p>Amazon Music</p>
            <p>Kindle E-readers & Books</p>
            <p>Amazon Appstore</p>
            <hr />
            <h4>Shop by Department</h4>
            <p>Electronics</p>
            <p>Computers</p>
            <p>Smart Home</p>
            <p>Arts & Crafts</p>
            <p>See all</p>
            <hr />
            <h4>Programs & Features</h4>
            <p>Gift Cards</p>
            <p>Shop By Interest</p>
            <p>Amazon Live</p>
            <p>International Shopping</p>
            <p>See all</p>
            <hr />
            <h4>Help & Settings</h4>
            <p>Your Account</p>
            <p>English</p>
            <p>United States</p>
            <p>Customer Service</p>
            <p>Sign Out</p>
          </SidebarDropdown>
        )}
      </SidebarMenu>

      <DeliveryOption>
        <span>Deliver to</span>
        <span>Netherlands</span>
      </DeliveryOption>

      <SearchContainer>
        <SearchDropdownTrigger onClick={() => setSearchDropdownOpen(!isSearchDropdownOpen)}>
          <span>All ▾</span>
          {isSearchDropdownOpen && (
            <SearchDropdown>
              <p>All Departments</p>
              <p>Arts & Crafts</p>
              <p>Automotive</p>
              <p>Baby</p>
              <p>Beauty & Personal Care</p>
              <p>Books</p>
              <p>Boys' Fashion</p>
              <p>Computers</p>
            </SearchDropdown>
          )}
        </SearchDropdownTrigger>
        <SearchBar>
          <input type="text" placeholder="Search Amazon" />
          <button>Search</button>
        </SearchBar>
      </SearchContainer>

      <LanguageOption onClick={toggleDropdown}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_the_United_States.svg" alt="EN" />
        <span>EN</span>
        <LanguageDropdown isOpen={isDropdownOpen}>
          <h4>Change language</h4>
          <p>English - EN</p>
          <p>español - ES</p>
          <p>العربية - AR</p>
          <p>Deutsch - DE</p>
          <p>עברית - HE</p>
          <p>한국어 - KO</p>
          <p>português - PT</p>
          <p>中文(简体) - ZH</p>
          <p>中文(繁體) - ZH</p>
          <hr />
          <h4>Change currency</h4>
          <p>$ - USD - US Dollar <a href="#">Change</a></p>
        </LanguageDropdown>
      </LanguageOption>

      <Nav>
        <NavOption>
          <span>Hello, {isDropdownOpen ? 'Olisa' : 'Sign in'}</span>
          <span>Account & Lists ▾</span>
          <DropdownContent className="dropdown-content">
            {isDropdownOpen ? (
              <>
                <h4>Your Lists</h4>
                <p>Create a List</p>
                <hr />
                <h4>Your Account</h4>
                <p>Your Account</p>
                <p>Your Orders</p>
                <p>Your Recommendations</p>
                <p>Recalls and Product Safety Alerts</p>
                <p>Your Subscribe & Save Items</p>
                <p>Your Prime Membership</p>
                <p>Sell on Amazon</p>
                <p>Content Library</p>
                <p>Devices</p>
                <p>Memberships & Subscriptions</p>
                <p>Amazon Drive</p>
                <p>Your Prime Video</p>
                <p>Switch Accounts</p>
                <p>Sign Out</p>
              </>
            ) : (
              <>
                <button
                  style={{
                    backgroundColor: "#ffd814",
                    padding: "8px",
                    border: "none",
                    borderRadius: "3px",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  Sign in
                </button>
                <p style={{ textAlign: "center" }}>
                  New customer? <a href="#">Start here.</a>
                </p>
                <hr />
                <h4>Your Lists</h4>
                <p>Create a List</p>
                <hr />
                <h4>Your Account</h4>
                <p>Your Account</p>
                <p>Your Orders</p>
                <p>Your Recommendations</p>
                <p>Your Subscribe & Save Items</p>
                <p>Your Prime Membership</p>
                <p>Sell on Amazon</p>
                <p>Content Library</p>
                <p>Devices</p>
                <p>Memberships & Subscriptions</p>
                <p>Amazon Drive</p>
                <p>Your Prime Video</p>
              </>
            )}
          </DropdownContent>
        </NavOption>
        <NavOption>
          <span>Returns</span>
          <span>& Orders</span>
        </NavOption>
        <NavOption>
          <span>Your</span>
          <span>Prime</span>
        </NavOption>
      </Nav>

      <Cart>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Amazon-Cart-Icon.png"
          alt="Cart"
        />
        <span>0</span>
      </Cart>
    </HeaderContainer>
  );
};

export default Header;

