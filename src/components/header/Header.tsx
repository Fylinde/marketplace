import IconButton from "components/buttons/IconButton";
import Image from "components/Image";
import { useAppContext } from "contexts/app/AppContext";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Box from "../Box";
import Categories from "../categories/Categories";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import MiniCart from "../mini-cart/MiniCart";
import SearchBox from "../search-box/SearchBox";
import Sidenav from "../sidenav/Sidenav";
import { Tiny } from "../Typography";
import StyledHeader from "./HeaderStyle";
import AccountSectionDialog from "./AccountSectionDialog";

type HeaderProps = {
  isFixed?: boolean;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ isFixed, className }) => {
  const [open, setOpen] = useState(false);
  const toggleSidenav = () => setOpen(!open);
  const { state } = useAppContext();
  const { cartList } = state.cart;

  const cartHandle = (
    <FlexBox ml="20px" style={{ display: 'flex', alignItems: "flex-start" }}>  {/* Applied style object */}
      <IconButton bg="gray.200" p="12px">
        <Icon size="20px">bag</Icon>
      </IconButton>

      {!!cartList.length && (
        <FlexBox
          borderRadius="300px"
          bg="error.main"
          px="5px"
          py="2px"
          style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}  
          ml="-1rem"
          mt="-9px"
        >
          <Tiny color="white" fontWeight="600">
            {cartList.length}
          </Tiny>
        </FlexBox>
      )}
    </FlexBox>
  );

  return (
    <StyledHeader className={className}>
      <Container
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}  // Applied inline styles
      >
        <FlexBox className="logo" style={{ display: 'flex', alignItems: "center", marginRight: "1rem" }}>  {/* Applied style object */}
          <Link to="/">
            <Image src="/assets/images/logo.svg" alt="logo" />
          </Link>

          {isFixed && (
            <div className="category-holder">
              <Categories>
                <FlexBox color="text.hint" style={{ display: 'flex', alignItems: "center", marginLeft: "1rem" }}> {/* Applied style object */}
                  <Icon>categories</Icon>
                  <Icon>arrow-down-filled</Icon>
                </FlexBox>
              </Categories>
            </div>
          )}
        </FlexBox>

        <FlexBox justifyContent="center" flex="1 1 0">
          <SearchBox />
        </FlexBox>

        <FlexBox className="header-right" style={{ display: 'flex', alignItems: "center" }}> {/* Applied style object */}
          <AccountSectionDialog
            handle={
              <IconButton ml="1rem" bg="gray.200" p="8px">
                <Icon size="28px">user</Icon>
              </IconButton>
            }
          />

          <Sidenav
            handle={cartHandle}
            position="right"
            open={open}
            width={380}
            toggleSidenav={toggleSidenav}
          >
            <MiniCart toggleSidenav={toggleSidenav} />
          </Sidenav>
        </FlexBox>
      </Container>
    </StyledHeader>
  );
};

export default Header;
