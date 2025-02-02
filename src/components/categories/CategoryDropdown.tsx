import navigations from "../../data/navigations";
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
  menuComponent?: string; // Optional component name as string
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
  position = "absolute",
}) => {
  // Define the mapping for MegaMenu components
  const megaMenu: { MegaMenu1: React.FC<any>; MegaMenu2: React.FC<any> } = {
    MegaMenu1,
    MegaMenu2,
  };

  return (
    <StyledCategoryDropdown open={open} position={position}>
      {navigations.map((item: NavigationItem, index: number) => {
        // Ensure menuComponent exists and is a valid key in megaMenu
        const menuComponent = item.menuComponent as keyof typeof megaMenu;
        const MegaMenu = megaMenu[menuComponent];

        return (
          <CategoryMenuItem
            title={item.title || "Untitled"}
            href={item.href || "#"}
            icon={item.icon}
            caret={!!item.menuData}
            key={item.title || index} // Use title or index as a fallback for key
          >
            {/* Render MegaMenu only if it exists */}
            {MegaMenu ? <MegaMenu data={item.menuData || {}} /> : null}
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
