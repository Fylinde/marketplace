import React, { useEffect, useState } from 'react';
import Container from '../Container';
import FlexBox from '../FlexBox';
import Icon from '../icon/Icon';
import Image from '../Image';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import NavLink from '../nav-link/NavLink';
import { Small } from '../Typography';
import StyledTopbar from './Topbar.style';

interface ListItem {
  title: string;
  imgUrl: string;
}

// Safe fallback values for each item list
const languageList: ListItem[] = [
  { title: 'EN', imgUrl: '/assets/images/flags/usa.png' },
  { title: 'BN', imgUrl: '/assets/images/flags/bd.png' },
  { title: 'HN', imgUrl: '/assets/images/flags/in.png' },
];

const currencyList: ListItem[] = [
  { title: 'USD', imgUrl: '/assets/images/flags/usa.png' },
  { title: 'EUR', imgUrl: '/assets/images/flags/uk.png' },
  { title: 'BDT', imgUrl: '/assets/images/flags/bd.png' },
  { title: 'INR', imgUrl: '/assets/images/flags/in.png' },
];

const Topbar: React.FC = () => {
  const [currency, setCurrency] = useState<ListItem>(currencyList[0] || { title: "USD", imgUrl: "" });
  const [language, setLanguage] = useState<ListItem>(languageList[0] || { title: "EN", imgUrl: "" });

  // Event handler for selecting currency
  const handleCurrencyClick = (curr: ListItem) => () => {
    setCurrency(curr);
  };

  // Event handler for selecting language
  const handleLanguageClick = (lang: ListItem) => () => {
    setLanguage(lang);
  };

  useEffect(() => {
    console.log("Browser Language:", navigator.language);
  }, []);

  return (
    <StyledTopbar>
      <Container style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
        
        <FlexBox className="topbar-left">
          <div className="logo">
            <img src="/assets/images/logo.svg" alt="logo" />
          </div>
          <FlexBox style={{ alignItems: "center" }}>
            <Icon size="14px">phone-call</Icon>
            <span></span>
          </FlexBox>
          <FlexBox style={{ alignItems: "center", marginLeft: "20px" }}>
            <Icon size="14px">#</Icon>
            <span></span>
          </FlexBox>
        </FlexBox>

        <FlexBox className="topbar-right" style={{ alignItems: "center" }}>
          <NavLink className="link" to="/faq">#</NavLink>
          <NavLink className="link" to="/help">Need Help?</NavLink>
          
          {/* Language Selector */}
          <Menu
            direction="right"
            handler={
              <FlexBox className="dropdown-handler" style={{ alignItems: "center", height: "40px", marginRight: "1.25rem" }}>
                <Image src={language.imgUrl || '/assets/images/flags/placeholder.png'} alt={language.title || 'Language'} />
                <Small fontWeight="600">{language.title || 'EN'}</Small>
                <Icon size="1rem">chevron-down</Icon>
              </FlexBox>
            }
          >
            {languageList.map((item) => (
              <MenuItem key={item.title} onClick={handleLanguageClick(item)}>
                <Image src={item.imgUrl || '/assets/images/flags/placeholder.png'} borderRadius="2px" mr="0.5rem" alt={item.title} />
                <Small fontWeight="600">{item.title}</Small>
              </MenuItem>
            ))}
          </Menu>
          
          {/* Currency Selector */}
          <Menu
            direction="right"
            handler={
              <FlexBox className="dropdown-handler" style={{ alignItems: "center", height: "40px" }}>
                <Image src={currency.imgUrl || '/assets/images/flags/placeholder.png'} alt={currency.title || 'Currency'} />
                <Small fontWeight="600">{currency.title || 'USD'}</Small>
                <Icon size="1rem">chevron-down</Icon>
              </FlexBox>
            }
          >
            {currencyList.map((item) => (
              <MenuItem key={item.title} onClick={handleCurrencyClick(item)}>
                <Image src={item.imgUrl || '/assets/images/flags/placeholder.png'} borderRadius="2px" mr="0.5rem" alt={item.title} />
                <Small fontWeight="600">{item.title}</Small>
              </MenuItem>
            ))}
          </Menu>
        </FlexBox>
      </Container>
    </StyledTopbar>
  );
};

export default Topbar;
