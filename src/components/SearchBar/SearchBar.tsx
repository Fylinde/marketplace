import React from 'react';

const SearchBar: React.FC = () => {
    return (
        <div className="search-bar">
            <select>
                <option value="all">All</option>
                <option value="laptops">Laptops</option>
                {/* More options */}
            </select>
            <input type="text" placeholder="Enter your search key ..." />
            <button type="submit">
                <i className="fa fa-search" />
            </button>
        </div>
    );
};

export default SearchBar;
