import { Link } from "react-router-dom"; // Import Link from react-router-dom
import React from "react";
import Icon from "../../icon/Icon";
import { StyledCategoryMenuItem } from "./CategoryMenuItemStyle";

interface CategoryMenuItemProps {
  href: string;
  icon?: string;
  title: string;
  caret?: boolean;
  children?: React.ReactNode; // Add children prop here
}

const CategoryMenuItem: React.FC<CategoryMenuItemProps> = ({
  href,
  icon,
  title,
  caret,
  children, // Accept children prop here
}) => {
  return (
    <StyledCategoryMenuItem>
      <Link to={href}> {/* Replace href with "to" for react-router-dom */}
        <div className="category-dropdown-link">
          {icon && <Icon variant="small">{icon}</Icon>}
          <span className="title">{title}</span>
          {caret && <Icon variant="small">chevron-right</Icon>}
        </div>
      </Link>
      {children} {/* Render children if provided */}
    </StyledCategoryMenuItem>
  );
};

CategoryMenuItem.defaultProps = {
  caret: true,
};

export default CategoryMenuItem;
