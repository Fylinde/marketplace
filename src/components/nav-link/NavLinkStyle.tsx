import systemCss from "@styled-system/css";
import styled from "styled-components";
import { color, ColorProps, compose, space, SpaceProps } from "styled-system";

// Define the props for StyledNavLink
interface StyledNavLinkProps {
  isCurrentRoute?: boolean;
  className?: string;
  [key: string]: unknown;
}

// Prevent isCurrentRoute from being passed to DOM elements
const StyledNavLink = styled.div
  .withConfig({
    shouldForwardProp: (prop) => prop !== 'isCurrentRoute', // Exclude isCurrentRoute from being forwarded
  })<StyledNavLinkProps & SpaceProps & ColorProps>(
  ({ isCurrentRoute, theme }) =>
    systemCss({
      position: "relative",
      color: isCurrentRoute ? theme?.colors?.primary?.main || "blue" : "auto",
      transition: "all 150ms ease-in-out",
      "&:hover": {
        color: `${theme?.colors?.primary?.main || "blue"} !important`,
      },
      "& svg path": {
        fill: isCurrentRoute ? theme?.colors?.primary?.main || "blue" : "auto",
      },
      "& svg polyline, svg polygon": {
        color: isCurrentRoute ? theme?.colors?.primary?.main || "blue" : "auto",
      },
    }),
  compose(space, color)
);

export default StyledNavLink;
