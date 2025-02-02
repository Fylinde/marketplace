import Box from "../Box";
import { Link, useLocation } from "react-router-dom"; // Use react-router-dom's Link and useLocation
import React from "react";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import {
  DashboardNavigationWrapper,
  StyledDashboardNav,
} from "./DashboardStyle";

const SellerDashboardNavigation = () => {
  const { pathname } = useLocation(); // Replacing useRouter with useLocation to get the current route

  return (
    <DashboardNavigationWrapper px="0px" py="1.5rem" color="gray.900">
      {linkList.map((item) => (
        <StyledDashboardNav
          as={Link} // Use Link from react-router-dom for navigation
          to={item.href} // 'to' is used with react-router-dom's Link
          isCurrentPath={pathname.includes(item.href)} // Check if current path matches the item's href
          key={item.title}
          px="1.5rem"
          mb="1.25rem"
        >
          <FlexBox alignItems="center">
            <Box className="dashboard-nav-icon-holder">
              <Icon variant="small" defaultcolor="currentColor" mr="10px">
                {item.iconName}
              </Icon>
            </Box>
            <span>{item.title}</span>
          </FlexBox>
          {item.count && <span>{item.count}</span>} {/* Show count only if it exists */}
        </StyledDashboardNav>
      ))}
    </DashboardNavigationWrapper>
  );
};

const linkList = [
  {
    href: "/seller/dashboard",
    title: "Dashboard",
    iconName: "board",
  },
  {
    href: "/seller/products",
    title: "Products",
    iconName: "box",
    count: 300,
  },
  {
    href: "/seller/add-product",
    title: "Add New Product",
    iconName: "upload",
  },
  {
    href: "/seller/orders",
    title: "Orders",
    iconName: "shopping-cart",
    count: 40,
  },
  {
    href: "/seller/account-settings",
    title: "Account Settings",
    iconName: "gear-2",
  },
];

export default SellerDashboardNavigation;
