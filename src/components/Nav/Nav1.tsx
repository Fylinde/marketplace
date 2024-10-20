import React from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu';

const Nav: React.FC = () => {
    return (
        <nav className="navigation">
            <ul>
                <li><a href="/">Home</a></li>
                <DropdownMenu title="Shop" />
                <DropdownMenu title="Blog" />
                <DropdownMenu title="Pages" />
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Nav;
