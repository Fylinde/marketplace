import styled from "styled-components";
import { color, compose, space, variant } from "styled-system";
import systemCss from "@styled-system/css";
import { IconProps } from "./Icon";

// Extend IconProps to include alignItems and justifyContent with common flex alignment options
interface ExtendedIconProps extends IconProps {
  alignItems?: "flex-start" | "center" | "flex-end" | "baseline" | "stretch";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
}

const StyledIcon = styled.div<ExtendedIconProps>(
  ({
    color,
    size = "1.5rem",        // Default size
    transform,
    defaultcolor = "currentColor",
    alignItems = "center",   // Default alignItems
    justifyContent = "center", // Default justifyContent
  }) =>
    systemCss({
      display: "flex",
      alignItems,       // Dynamic alignItems
      justifyContent,   // Dynamic justifyContent
      width: size,
      height: size,
      transform,

      svg: {
        width: "100%",
        height: "100%",
        path: {
          fill: color ? `${color}.main` : defaultcolor,
        },
        polyline: {
          fill: color ? `${color}.main` : defaultcolor,
        },
        polygon: {
          fill: color ? `${color}.main` : defaultcolor,
        },
      },
    }),
  ({ size }) =>
    variant({
      prop: "variant",
      variants: {
        small: {
          width: size || "1.25rem",
          height: size || "1.25rem",
        },
        medium: {
          width: size || "1.5rem",
          height: size || "1.5rem",
        },
        large: {
          width: size || "2rem",
          height: size || "2rem",
        },
      },
    }),
  compose(color, space)
);

export default StyledIcon;
