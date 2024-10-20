import React, { useState } from 'react';

interface DropdownMenuProps {
    title: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li className="dropdown-menu" onMouseEnter={toggleMenu} onMouseLeave={toggleMenu}>
            <a href="#">{title}</a>
            {isOpen && (
                <div className="dropdown-content">
                    <ul>
                        {/* Add menu items here */}
                    </ul>
                </div>
            )}
        </li>
    );
};

export default DropdownMenu;
