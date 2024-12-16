import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserFullName } from '../../redux/slices/auth/authSlice';


const SidebarMenu: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const userFullName = useSelector(selectUserFullName);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Sidebar Menu (Hamburger icon) */}
      <div style={menuContainer}>
        <div style={menuStyle} onClick={toggleSidebar}>
          <span>☰</span> <span style={allTextStyle}>All</span>
        </div>
      </div>

      {/* Sidebar Content */}
      {isSidebarOpen && (
        <div style={sidebarOverlay}>
          <div style={sidebarContent}>
            <div style={closeButtonContainer}>
              <button style={closeButton} onClick={closeSidebar}>X</button>
            </div>
            <h1><strong>Welcome, {userFullName ? `Hello, ${userFullName}` : 'Hello, Guest'}</strong></h1>
            {/* <p><strong>Hello, User</strong></p> */}
            <h4>Digital Content & Devices</h4>
            <p>Fylinde Music</p>
            <p>Kindle E-readers & Books</p>
            <p>Fylinde Appstore</p>
            <hr />
            <h4>Shop by Department</h4>
            <p>Electronics</p>
            <p>Computers</p>
            <p>Smart Home</p>
            <p>Arts & Crafts</p>
            <p>See all</p>
            <hr />
            <h4>Help & Settings</h4>
            <p>Your Account</p>
            <p>English</p>
            <p>Customer Service</p>
            <p>Sign Out</p>
          </div>
        </div>
      )}
    </>
  );
};

const menuContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const menuStyle: React.CSSProperties = {
  fontSize: '24px',
  padding: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const allTextStyle: React.CSSProperties = {
  marginLeft: '5px',  // Reduced spacing between the icon and "All"
  fontSize: '16px',
};

const sidebarOverlay: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '300px',
  height: '100%',
  backgroundColor: '#37475a',
  zIndex: 1000,
};

const sidebarContent: React.CSSProperties = {
  padding: '20px',
  color: 'white',
  fontSize: '14px',
};

const closeButtonContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const closeButton: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '18px',
  cursor: 'pointer',
};

export default SidebarMenu;

