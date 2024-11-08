import { Link, useLocation } from "react-router-dom";
import React, { ReactNode } from "react";
import { CSSProperties } from "styled-components";
import { ColorProps, SpaceProps } from "styled-system";
import StyledNavLink from "./NavLinkStyle";

export interface NavLinkProps extends SpaceProps, ColorProps {
  to: string; // Use 'to' for react-router-dom
  style?: CSSProperties;
  className?: string;
  children: ReactNode; // Add children prop explicitly
  target?: string;  // Allow external link handling
  rel?: string;     // Allow external link handling
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, style, className, ...props }) => {
  const { pathname } = useLocation();  // useLocation replaces useRouter

  const checkRouteMatch = () => {
    if (to === "/") return pathname === to;
    return pathname.includes(to);
  };

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <StyledNavLink
        className={className}
        isCurrentRoute={checkRouteMatch()}
        style={style}
        {...props}
      >
        {children}
      </StyledNavLink>
    </Link>
  );
};

export default NavLink;
