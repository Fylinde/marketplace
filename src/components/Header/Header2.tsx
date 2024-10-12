// Import React and necessary hooks
import React from 'react';

// Define the Header component
const Header: React.FC = () => {
    return (
        <>
            {/* Header Section */}
            <header style={headerStyles}>
                {/* Logo and Delivery Section */}
                <div style={logoSection}>
                    <img src="https://via.placeholder.com/100x40?text=Logo" alt="Logo" style={logoImg} />
                    <div>
                        <span>Deliver to</span>
                        <div style={locationText}>Lagos</div>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={searchBar}>
                    <select style={selectStyle}>
                        <option>All</option>
                    </select>
                    <input type="text" placeholder="Search Mysite" style={inputStyle} />
                    <button style={buttonStyle}>
                        <img src="https://via.placeholder.com/16x16?text=S" alt="Search" />
                    </button>
                </div>

                {/* Account, Orders, Cart */}
                <div style={headerRight}>
                    {/* Language */}
                    <div style={langStyle}>
                        <img src="https://via.placeholder.com/20x10?text=EN" alt="EN" style={langImg} />
                        <span>EN</span>
                    </div>

                    {/* Account */}
                    <div style={accountStyle}>
                        <span>Hello, Fabian</span><br />
                        Account & Lists
                    </div>

                    {/* Orders */}
                    <div style={ordersStyle}>
                        <span>Returns</span><br />
                        & Orders
                    </div>

                    {/* Cart */}
                    <div style={cartStyle}>
                        <div style={cartIcon}>
                            <img src="https://via.placeholder.com/24x24?text=C" alt="Cart" />
                            <div style={cartCount}>0</div>
                        </div>
                        <span>Cart</span>
                    </div>
                </div>
            </header>

            {/* Navigation Menu */}
            <nav style={navBar}>
                <div style={menu}>
                    <a href="#" style={linkStyle}>All</a>
                    <a href="#" style={linkStyle}>Today's Deals</a>
                    <a href="#" style={linkStyle}>Buy Again</a>
                    <a href="#" style={linkStyle}>Customer Service</a>
                    <a href="#" style={linkStyle}>Registry</a>
                    <a href="#" style={linkStyle}>Gift Cards</a>
                    <a href="#" style={linkStyle}>Sell</a>
                </div>
                <a href="#" style={storeLink}>Shop the Gaming Store</a>
            </nav>
        </>
    );
};

// Define styles as objects for each part of the component
const headerStyles: React.CSSProperties = {
    backgroundColor: '#232f3e',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const logoSection: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const logoImg: React.CSSProperties = {
    height: '40px',
};

const locationText: React.CSSProperties = {
    fontWeight: 'bold',
};

const searchBar: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    margin: '0 20px',
};

const selectStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
    backgroundColor: '#f3f3f3',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderLeft: 'none',
    borderRadius: '0',
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#febd69',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '0 4px 4px 0',
};

const headerRight: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const langStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
};

const langImg: React.CSSProperties = {
    height: '14px',
    marginRight: '5px',
};

const accountStyle: React.CSSProperties = {
    marginRight: '20px',
    textAlign: 'left',
    fontSize: '12px',
};

const ordersStyle: React.CSSProperties = {
    marginRight: '20px',
    textAlign: 'left',
    fontSize: '12px',
};

const cartStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
};

const cartIcon: React.CSSProperties = {
    position: 'relative',
};

const cartCount: React.CSSProperties = {
    position: 'absolute',
    top: '-5px',
    right: '-10px',
    backgroundColor: 'orange',
    color: 'white',
    fontSize: '12px',
    padding: '2px 5px',
    borderRadius: '50%',
};

const navBar: React.CSSProperties = {
    backgroundColor: '#37475a',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
};

const menu: React.CSSProperties = {
    display: 'flex',
};

const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    padding: '0 15px',
    fontSize: '14px',
};

const storeLink: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
};

// Export the component for use
export default Header;
