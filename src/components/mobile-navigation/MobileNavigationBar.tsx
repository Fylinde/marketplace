import { Chip } from "components/Chip";
import { useAppContext } from "contexts/app/AppContext";
import React from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Icon from "../icon/Icon";
import NavLink from "../nav-link/NavLink";
import StyledMobileNavigationBar from "./MobileNavigationBar.style";

const MobileNavigationBar: React.FC = () => {
  const { width } = useWindowSize();  // Access the width property from useWindowSize hook
  const { state } = useAppContext();
  const { cartList } = state.cart;

  // Return null if width is greater than 900 or is undefined
  if (width === null || width > 900) {
    return null;
  }

  return (
    <StyledMobileNavigationBar>
      {list.map((item) => (
        <NavLink className="link" to={item.href} key={item.title}>
          <Icon className="icon" variant="small">
            {item.icon}
          </Icon>
          {item.title}

          {item.title === "Cart" && !!cartList.length && (
            <Chip
              bg="primary.main"
              position="absolute"
              color="primary.text"
              fontWeight="600"
              px="0.25rem"
              top="4px"
              left="calc(50% + 8px)"
            >
              {cartList.length}
            </Chip>
          )}
        </NavLink>
      ))}
    </StyledMobileNavigationBar>
  );
};

const list = [
  {
    title: "Home",
    icon: "home",
    href: "/",
  },
  {
    title: "Category",
    icon: "category",
    href: "/mobile-category-nav",
  },
  {
    title: "Cart",
    icon: "bag",
    href: "/cart",
  },
  {
    title: "Account",
    icon: "user-2",
    href: "/profile",
  },
];

export default MobileNavigationBar;
