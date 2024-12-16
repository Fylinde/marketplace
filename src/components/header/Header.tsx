import IconButton from "../../components/buttons/IconButton";
import Image from "../../components/Image";
import { Link, useLocation } from "react-router-dom";
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
import LinearProgress from "../progressbar/LinearProgress";
import { useAppSelector } from "../../redux/reduxHooks"; // Use typed hooks

type HeaderProps = {
  isFixed?: boolean;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ isFixed, className }) => {
  const [open, setOpen] = useState(false);
  const toggleSidenav = () => setOpen(!open);

  // Use Redux to access cart state
  const cartList = useAppSelector((state) => state.cart.cartList); // Replace "cartList" with your actual state structure

  // Use useLocation to determine the current route
  const location = useLocation();

  // Map routes to progress steps
  const stepMapping: { [key: string]: number } = {
    "/cart": 0, // Step 0: Cart
    "/checkout/shipping": 1, // Step 1: Shipping
    "/checkout/payment": 2, // Step 2: Payment
    "/checkout/confirmation": 3, // Step 3: Confirmation
  };

  // Determine the current step and progress
  const currentStep = stepMapping[location.pathname] ?? -1;
  const progressPercentage =
    currentStep >= 0 ? ((currentStep + 1) / Object.keys(stepMapping).length) * 100 : 0;

  const cartHandle = (
    <FlexBox ml="20px" style={{ display: "flex", alignItems: "flex-start" }}>
      <IconButton bg="gray.200" p="12px">
        <Icon size="20px">bag</Icon>
      </IconButton>

      {!!cartList.length && (
        <FlexBox
          borderRadius="300px"
          bg="error.main"
          px="5px"
          py="2px"
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
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
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <FlexBox className="logo" style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}>
          <Link to="/">
            <Image src="/assets/images/logo.svg" alt="logo" />
          </Link>

          {isFixed && (
            <div className="category-holder">
              <Categories>
                <FlexBox
                  color="text.hint"
                  style={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}
                >
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

        <FlexBox className="header-right" style={{ display: "flex", alignItems: "center" }}>
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
            <MiniCart toggleSidenav={toggleSidenav} currentStep={currentStep} />
          </Sidenav>
        </FlexBox>
      </Container>

      {/* Progress Indicator */}
      {currentStep >= 0 && (
        <Box mt="1rem">
          <LinearProgress
            value={progressPercentage}
            label={`Step ${currentStep + 1} of ${Object.keys(stepMapping).length}`}
            color="primary"
            thickness={6}
          />
        </Box>
      )}
    </StyledHeader>
  );
};

export default Header;
