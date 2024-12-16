import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Menu } from "antd";
import { getLocalizedText } from "../../../utils/localizationUtils";

const SidebarContainer = styled.div`
  height: 100vh;
  background-color: #f0f2f5;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

// Define types for menu items
type MenuItem = {
  title: string;
  icon: string;
  path?: string; // Top-level items with a direct path
  children?: Array<{ title: string; path: string }>; // Nested items
};

// Menu configuration with types
const menuConfig: MenuItem[] = [
  {
    title: "Overview",
    icon: "dashboard",
    path: "/vendor/dashboard",
  },
  {
    title: "Product Management",
    icon: "box",
    children: [
      { title: "Product List", path: "/vendor/products" },
      { title: "Add Product", path: "/vendor/add-product" },
      { title: "Price & Promotion", path: "/vendor/price-and-promotion" },
      { title: "Business Recommendations", path: "/vendor/business-recommendations" },
    ],
  },
  {
    title: "Order Management",
    icon: "shopping-cart",
    children: [
      { title: "Order History", path: "/vendor/orders" },
      { title: "Dispute Management", path: "/vendor/order-management/dispute-management" },
      { title: "Return & Refund", path: "/vendor/order-management/return-and-refund" },
    ],
  },
  {
    title: "Analytics",
    icon: "bar-chart",
    children: [
      { title: "Analytics Dashboard", path: "/vendor/analytics" },
      { title: "Performance Metrics", path: "/vendor/performance" },
    ],
  },
  {
    title: "Shipping",
    icon: "truck",
    children: [
      { title: "Shipping Management", path: "/vendor/shipping" },
      { title: "Warehouse Manager", path: "/vendor/shipping/warehouse-manager" },
    ],
  },
  {
    title: "Billing & Payments",
    icon: "dollar",
    children: [
      { title: "Billing Summary", path: "/vendor/billing" },
      { title: "Payment History", path: "/vendor/payment-history" },
    ],
  },
  {
    title: "Account Settings",
    icon: "setting",
    path: "/vendor/account-settings",
  },
  {
    title: "Support",
    icon: "question-circle",
    path: "/vendor/support",
  },
];

const DashboardSidebar: React.FC = () => {
  const { pathname } = useLocation();

  // Recursive menu rendering
  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => {
      if (item.children) {
        // Render submenus
        return (
          <Menu.SubMenu
            key={item.title}
            icon={<span className={`icon-${item.icon}`} />}
            title={getLocalizedText(item.title, "sidebar")}
          >
            {renderMenu(item.children.map((child) => ({ ...child, icon: "" })))} {/* Pass nested items */}
          </Menu.SubMenu>
        );
      }
      // Render menu items with direct paths
      return (
        <Menu.Item key={item.path} icon={<span className={`icon-${item.icon}`} />}>
          <Link to={item.path || "#"}>{getLocalizedText(item.title, "sidebar")}</Link>
        </Menu.Item>
      );
    });

  return (
    <SidebarContainer>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        defaultOpenKeys={menuConfig.map((item) => item.title)}
      >
        {renderMenu(menuConfig)}
      </Menu>
    </SidebarContainer>
  );
};

export default DashboardSidebar;
