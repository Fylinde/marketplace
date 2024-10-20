import systemCss from "@styled-system/css";
import styled from "styled-components";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  layout,
  LayoutProps,
  shadow,
  space,
  SpaceProps,
  variant,
  BackgroundProps,
} from "styled-system";
import { colorOptions } from "interfaces"; // Assuming colorOptions are declared in 'interfaces'

type ColorKeys = "primary" | "secondary" | "text" | "error" | "warning"; // Define based on your theme colors

interface ButtonProps {
  size?: "small" | "medium" | "large" | "none";
  color?: ColorKeys | undefined; // Use the manual color keys type
  variant?: "text" | "outlined" | "contained";
  fullwidth?: boolean;
}


// Fix: Destructure theme from props
const Button = styled.button<
  ColorProps &
    BackgroundProps &
    BorderProps &
    SpaceProps &
    ButtonProps &
    LayoutProps
>(
  ({ color = "text", fullwidth, theme }) => // Destructure theme here
    systemCss({
      display: "flex",
      width: fullwidth ? "100%" : "unset",
      justifyContent: "center",
      alignItems: "center",
      outline: "none",
      border: "none",
      cursor: "pointer",
      padding: "11px 1.5rem",
      fontSize: "1rem",
      fontWeight: 600,
      color: color ? `${theme.colors[color]?.main}` : "body.text", // Now theme is properly referenced
      background: "transparent",
      transition: "all 150ms ease-in-out",
      lineHeight: 1,
      "&:focus": {
        boxShadow: 3, // Assuming 'shadows[3]' refers to the theme shadow
      },
      "&:disabled": {
        bg: "text.disabled",
        color: "text.hint",
        borderColor: "text.disabled",
        cursor: "unset",
        "svg path": {
          fill: "text.hint",
        },
        "svg polyline, svg polygon": {
          color: "text.hint",
        },
      },
    }),
  ({ theme, color = "text" }) => // Destructure theme here as well
    variant({
      prop: "variant",
      variants: {
        text: {
          border: "none",
          color: `${theme.colors[color]?.main ?? "text.primary"}`, // Fallback to 'text.primary'
          "&:hover": {
            bg: theme.colors[color]?.light ?? "gray.100", // Fallback to 'gray.100'
          },
        },
        outlined: {
          padding: "10px 16px",
          color: `${theme.colors[color]?.main ?? "text.primary"}`, // Fallback to 'text.primary'
          border: "1px solid",
          borderColor: theme.colors[color]?.main ?? "text.disabled",
          "&:enabled svg path": {
            fill: `${theme.colors[color]?.main ?? "text.primary"} !important`,
          },
          "&:enabled svg polyline, svg polygon": {
            color: `${theme.colors[color]?.main ?? "text.primary"} !important`,
          },
          "&:focus": {
            boxShadow: `0px 1px 4px 0px ${theme.colors[color]?.light ?? "gray.300"}`, // Fallback to 'gray.300'
          },
          "&:hover:enabled": {
            bg: theme.colors[color]?.main ?? "gray.100", // Fallback to 'gray.100'
            borderColor: theme.colors[color]?.main ?? "text.disabled", // Fallback to 'text.disabled'
            color: theme.colors[color]?.text ?? "text.primary", // Fallback to 'text.primary'
            "svg path": {
              fill: `${theme.colors[color]?.text ?? "text.primary"} !important`, // Fallback to 'text.primary'
            },
            "svg polyline, svg polygon": {
              color: `${theme.colors[color]?.text ?? "text.primary"} !important`, // Fallback to 'text.primary'
            },
          },
        },
        contained: {
          border: "none",
          color: `${theme.colors[color]?.text ?? "text.primary"}`, // Fallback to 'text.primary'
          bg: `${theme.colors[color]?.main ?? "text.primary"}`, // Fallback to 'text.primary'
          "&:focus": {
            boxShadow: `0px 1px 4px 0px ${theme.colors[color]?.light ?? "gray.300"}`, // Fallback to 'gray.300'
          },
          "&:enabled svg path": {
            fill: `${theme.colors[color]?.text ?? "text.primary"} !important`, // Fallback to 'text.primary'
          },
          "&:enabled svg polyline, svg polygon": {
            color: `${theme.colors[color]?.text ?? "text.primary"} !important`, // Fallback to 'text.primary'
          },
        },
      },
    }),
  variant({
    prop: "size",
    variants: {
      large: {
        height: "56px",
        px: 30,
      },
      medium: {
        height: "48px",
        px: 30,
      },
      small: {
        height: "40px",
        fontSize: 14,
      },
    },
  }),
  compose(color, layout, space, border, shadow)
);

// Set default values for Button props
Button.defaultProps = {
  size: "small",
  borderRadius: 5,
};

export default Button;
