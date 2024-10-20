import React, { useState } from 'react';

const TopBar: React.FC = () => {
    const [currency, setCurrency] = useState('USD');
    const [language, setLanguage] = useState('English');

    return (
        <div className="top-bar">
            <p>Telephone Enquiry: (+123) 123 321 345</p>
            <div className="settings">
                <div className="setting-dropdown">
                    <span>Currency: {currency}</span>
                    <ul>
                        <li onClick={() => setCurrency('USD')}>USD</li>
                        <li onClick={() => setCurrency('GBP')}>GBP</li>
                        <li onClick={() => setCurrency('EUR')}>EUR</li>
                    </ul>
                </div>
                <div className="setting-dropdown">
                    <span>Language: {language}</span>
                    <ul>
                        <li onClick={() => setLanguage('English')}>English</li>
                        <li onClick={() => setLanguage('French')}>French</li>
                        <li onClick={() => setLanguage('Spanish')}>Spanish</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
