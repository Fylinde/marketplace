import navigations from "@data/navigations";
import React from "react";
import CategoryMenuItem from "./category-menu-item/CategoryMenuItem";
import { StyledCategoryDropdown } from "./CategoryDropdownStyle";
import MegaMenu1 from "./mega-menu/MegaMenu1";
import MegaMenu2 from "./mega-menu/MegaMenu2";

// Define the type for navigation items
interface NavigationItem {
  title: string;
  href: string;
  icon?: string;
  menuComponent?: string; // Loosened this to be any string
  menuData?: any; // You can type this more strictly if you know the structure
}

// Define the props for CategoryDropdown
export interface CategoryDropdownProps {
  open: boolean;
  position?: "absolute" | "relative";
}

// Main CategoryDropdown component
const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  open,
  position,
}) => {
  // Define the mapping for MegaMenu components
  const megaMenu: { MegaMenu1: React.FC<any>; MegaMenu2: React.FC<any> } = {
    MegaMenu1,
    MegaMenu2,
  };

  return (
    <StyledCategoryDropdown open={open} position={position}>
      {navigations.map((item: NavigationItem, index: number) => {
        // Safely cast and ensure it's one of the valid menu components
        const MegaMenu = megaMenu[item.menuComponent as keyof typeof megaMenu];

        return (
          <CategoryMenuItem
            title={item.title}
            href={item.href}
            icon={item.icon}
            caret={!!item.menuData}
            key={item.title}
          >
            {/* Ensure the MegaMenu exists before rendering */}
            {MegaMenu && <MegaMenu data={item.menuData || {}} />}
          </CategoryMenuItem>
        );
      })}
    </StyledCategoryDropdown>
  );
};

// Default props
CategoryDropdown.defaultProps = {
  position: "absolute",
};

export default CategoryDropdown;
