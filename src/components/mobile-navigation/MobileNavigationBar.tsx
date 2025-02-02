import React, { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Icon from "../icon/Icon";
import NavLink from "../nav-link/NavLink";
import StyledMobileNavigationBar from "./MobileNavigationBar.style";
import { useAppSelector, useAppDispatch } from "../../redux/reduxHooks";
import { Chip } from "../../components/Chip";
import Tooltip from "../../components/tooltip/Tooltip"; // Add a tooltip component
import { fetchNavigationItems } from "../../redux/slices/support/navigationSlice"; // Redux action for dynamic navigation

const MobileNavigationBar: React.FC = () => {
  const { width } = useWindowSize(); // Get window width dynamically
  const dispatch = useAppDispatch();

  // Redux State
  const { cartList } = useAppSelector((state) => state.cart);
  const { navigationItems } = useAppSelector((state) => state.navigation); // Dynamic navigation state

  // Fetch navigation items dynamically on mount
  useEffect(() => {
    dispatch(fetchNavigationItems());
  }, [dispatch]);

  // Return null if width is greater than 900
  if (width === null || width > 900) {
    return null;
  }

  return (
    <StyledMobileNavigationBar>
      {navigationItems.map((item) => (
        <NavLink
          className="link"
          to={item.href}
          key={item.title}
          aria-label={item.title} // Add ARIA labels for accessibility
        >
          <Tooltip content={item.title}>
            <Icon className="icon" variant="small">
              {item.icon}
            </Icon>
          </Tooltip>
          {item.title}

          {/* Dynamic badge for the cart */}
          {item.title === "Cart" && !!cartList.length && (
            <Chip
              bg="primary.main"
              position="absolute"
              color="primary.text"
              fontWeight="600"
              px="0.25rem"
              top="4px"
              left="calc(50% + 8px)"
              className="cart-badge"
            >
              {cartList.length}
            </Chip>
          )}
        </NavLink>
      ))}
    </StyledMobileNavigationBar>
  );
};

export default MobileNavigationBar;
