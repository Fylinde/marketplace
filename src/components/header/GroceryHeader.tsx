import IconButton from "components/buttons/IconButton";
import GrocerySearchBox from "components/search-box/GrocerySearchBox";
import { Tiny } from "components/Typography";
import { useAppContext } from "contexts/app/AppContext";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Box from "../Box";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import MiniCart from "../mini-cart/MiniCart";
import Login from "../sessions/Login";
import Sidenav from "../sidenav/Sidenav";
import StyledHeader from "./HeaderStyle";
import UserLoginDialog from "components/header/UserLoginDialog";

type HeaderProps = {
  isFixed?: boolean;
  className?: string;
};

const GroceryHeader: React.FC<HeaderProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const toggleSidenav = () => setOpen(!open);

  const { state } = useAppContext();
  const { cartList } = state.cart;

  const cartHandle = (
    <FlexBox ml="20px" style={{ alignItems: "flex-start" }}>  {/* Moved alignItems to style */}
      <IconButton bg="gray.200" p="12px">
        <Icon size="20px">bag</Icon>
      </IconButton>

      {!!cartList.length && (
        <FlexBox
          borderRadius="300px"
          bg="error.main"
          px="5px"
          py="2px"
          style={{ alignItems: "center", justifyContent: "center" }}  
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
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}  
      >
        <FlexBox className="logo" style={{ alignItems: "center", marginRight: "1rem" }}> 
          <Link to="/">
            <img src="/assets/images/logo.svg" alt="logo" />
          </Link>
        </FlexBox>

        <FlexBox justifyContent="center" flex="1 1 0">
          <GrocerySearchBox />
        </FlexBox>

        <FlexBox className="header-right" style={{ alignItems: "center" }}> {/* Moved alignItems to style */}
          <UserLoginDialog
            handle={
              <IconButton ml="1rem" bg="gray.200" p="8px">
                <Icon size="28px">user</Icon>
              </IconButton>
            }
          >
            <Box>
              <Login />
            </Box>
          </UserLoginDialog>

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

export default GroceryHeader;
