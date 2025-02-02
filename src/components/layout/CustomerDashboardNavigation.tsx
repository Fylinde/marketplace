import Box from "../../components/Box";
import { useLocation } from "react-router-dom"; // Replace useRouter with useLocation
import React, { Fragment } from "react";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Typography from "../Typography";
import { DashboardNavigationWrapper, StyledDashboardNav } from "./DashboardStyle";

const CustomerDashboardNavigation = () => {
  const { pathname } = useLocation(); // Use useLocation to get the current path

  return (
    <DashboardNavigationWrapper px="0px" pb="1.5rem" color="gray.900">
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p="26px 30px 1rem" color="text.muted" fontSize="12px">
            {item.title}
          </Typography>
          {item.list.map((subItem) => (
            <StyledDashboardNav
              to={subItem.href} // Use 'to' for react-router-dom navigation
              isCurrentPath={pathname.includes(subItem.href)} // Check if current path matches
              key={subItem.title}
              px="1.5rem"
              mb="1.25rem"
            >
              <FlexBox alignItems="center">
                <Box className="dashboard-nav-icon-holder">
                  <Icon variant="small" defaultcolor="currentColor" mr="10px">
                    {subItem.iconName}
                  </Icon>
                </Box>
                <span>{subItem.title}</span>
              </FlexBox>
              <span>{subItem.count}</span>
            </StyledDashboardNav>
          ))}
        </Fragment>
      ))}
    </DashboardNavigationWrapper>
  );
};

const linkList = [
  {
    title: "DASHBOARD",
    list: [
      {
        href: "/orders",
        title: "Orders",
        iconName: "bag",
        count: 5,
      },
      {
        href: "/wish-list",
        title: "Wishlist",
        iconName: "heart",
        count: 19,
      },
      {
        href: "/support-tickets",
        title: "Support Tickets",
        iconName: "customer-service",
        count: 1,
      },
    ],
  },
  {
    title: "ACCOUNT SETTINGS",
    list: [
      {
        href: "/profile",
        title: "Profile Info",
        iconName: "user",
        count: 3,
      },
      {
        href: "/address",
        title: "Addresses",
        iconName: "pin",
        count: 16,
      },
      {
        href: "/payment-methods",
        title: "Payment Methods",
        iconName: "credit-card",
        count: 4,
      },
    ],
  },
];

export default CustomerDashboardNavigation;
