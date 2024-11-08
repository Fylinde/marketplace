import Box from 'components/Box';
import Button from 'components/buttons/Button';
import IconButton from 'components/buttons/IconButton';
import Container from 'components/Container';
import FlexBox from 'components/FlexBox';
import Icon from 'components/icon/Icon';
import Image from 'components/Image';
import Sidenav from 'components/sidenav/Sidenav';
import Typography from 'components/Typography';
import { getTheme } from 'utils/utils';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Link as Scroll } from 'react-scroll';
import styled from 'styled-components';

const DEFAULT_HEADER_HEIGHT = 72;

interface HeaderProps {
  headerHeight?: number;
}

const HeaderWrapper = styled.div<{ fixed: boolean; headerHeight: number }>`
  box-shadow: ${(props) => props.fixed && getTheme('shadows.regular')};
  position: ${(props) => (props.fixed ? 'fixed' : 'relative')};
  top: ${(props) => (props.fixed ? '0' : 'auto')};
  background: white;
  height: ${(props) => props.headerHeight}px;
  z-index: 99;

  .link {
    transition: color 250ms ease-in-out;
    cursor: pointer;
    color: inherit;
    :hover {
      color: ${getTheme('colors.primary.main')};
    }
  }

  .menu {
    display: none;
  }

  @media only screen and (max-width: 700px) {
    .right-links {
      display: none;
    }
    .menu {
      display: unset;
    }
  }
`;

const Header: React.FC<HeaderProps> = ({ headerHeight = DEFAULT_HEADER_HEIGHT }) => {
  const [open, setOpen] = useState(false);
  const [isFixed, setFixed] = useState(false);

  const toggleSidenav = () => setOpen(!open);

  const scrollListener = useCallback(
    debounce(() => setFixed(window?.pageYOffset >= headerHeight), 50),
    [headerHeight]
  );

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  const headerLinks = [
    { label: 'Features', to: 'features', offset: -(headerHeight + 16) },
    { label: 'Demos', to: 'demos', offset: -(headerHeight + 16) },
    { label: 'Technologies', to: 'technologies', offset: -(headerHeight + 16) },
    { label: 'Pricing', to: 'price', offset: -headerHeight },
  ];

  return (
    <HeaderWrapper fixed={isFixed} headerHeight={headerHeight}>
      <Container>
        <FlexBox justifyContent="space-between" alignItems="center" height={headerHeight}>
          <Scroll to="top" duration={400} smooth={true} isDynamic>
            <Box cursor="pointer">
              <Image width="96px" height="44px" src="/assets/images/logo.svg" alt="logo" />
            </Box>
          </Scroll>

          <FlexBox className="right-links" alignItems="center">
            {headerLinks.map((link) => (
              <Scroll key={link.to} to={link.to} duration={400} offset={link.offset} smooth={true}>
                <Typography className="link" color="text.muted" p="0.25rem 1.25rem">
                  {link.label}
                </Typography>
              </Scroll>
            ))}
            <a href="https://1.envato.market/oeNbNe">
              <Button variant="outlined" color="primary">Purchase Now</Button>
            </a>
          </FlexBox>

          <Sidenav
            handle={
              <IconButton className="menu">
                <Icon>menu</Icon>
              </IconButton>
            }
            open={open}
            position="right"
            width={260}
            toggleSidenav={toggleSidenav}
          >
            <Box p="1rem">
              {headerLinks.map((link) => (
                <Scroll key={link.to} to={link.to} duration={400} offset={link.offset} smooth={true}>
                  <Typography className="link" py="0.5rem" onClick={toggleSidenav}>{link.label}</Typography>
                </Scroll>
              ))}
              <Button variant="outlined" color="primary">Purchase Now</Button>
            </Box>
          </Sidenav>
        </FlexBox>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
