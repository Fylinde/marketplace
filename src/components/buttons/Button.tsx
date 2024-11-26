import styled from "styled-components";
import {
  border,
  BorderProps,
  color as styledColor,
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
import React from "react";

// Define a ButtonProps interface for all props used in the button
interface ButtonProps
  extends LayoutProps,
    SpaceProps,
    BorderProps,
    BackgroundProps,
    ColorProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large"; // Button size
  color?: "primary" | "secondary" | "text" | "error" | "warning"; // Predefined color variants
  variant?: "text" | "outlined" | "contained"; // Button style variants
  fullwidth?: boolean; // Makes the button occupy full width
  disabled?: boolean; // Disables the button
  href?: string; // Used for links
  as?: React.ElementType; // Allows polymorphic behavior
  children: React.ReactNode; // Button content
  borderRadius?: string; // Explicitly define borderRadius
}

// Define a theme for use with styled-components
const theme = {
  colors: {
    primary: { main: "#6200EE", light: "#BB86FC", dark: "#3700B3", text: "#FFFFFF" },
    secondary: { main: "#03DAC6", light: "#67E8F9", dark: "#018786", text: "#000000" },
    text: { main: "#000000", light: "#666666", dark: "#333333" },
    error: { main: "#B00020", light: "#FFCDD2", dark: "#7F0000", text: "#FFFFFF" },
    warning: { main: "#FFC107", light: "#FFD54F", dark: "#FFA000", text: "#000000" },
  },
};

// Externalize button variants to avoid inline `props` conflicts
const buttonVariants = variant({
  prop: "variant",
  variants: {
    text: {
      backgroundColor: "transparent",
      color: (props: any) =>
        props.theme?.colors?.[props.color ?? "text"]?.main || "#000",
      "&:hover": {
        backgroundColor: (props: any) =>
          props.theme?.colors?.[props.color ?? "text"]?.light || "#f5f5f5",
      },
    },
    outlined: {
      border: "1px solid",
      borderColor: (props: any) =>
        props.theme?.colors?.[props.color ?? "text"]?.main || "#000",
      backgroundColor: "transparent",
      color: (props: any) =>
        props.theme?.colors?.[props.color ?? "text"]?.main || "#000",
      "&:hover": {
        backgroundColor: (props: any) =>
          props.theme?.colors?.[props.color ?? "text"]?.light || "#f5f5f5",
      },
    },
    contained: {
      backgroundColor: (props: any) =>
        props.theme?.colors?.[props.color ?? "text"]?.main || "#000",
      color: (props: any) =>
        props.theme?.colors?.[props.color ?? "text"]?.text || "#fff",
      "&:hover": {
        backgroundColor: (props: any) =>
          props.theme?.colors?.[props.color ?? "text"]?.dark || "#444",
      },
    },
  },
});

// Styled button component with fixes
const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.fullwidth ? "100%" : "auto")};
  padding: ${(props) =>
    props.size === "small"
      ? "8px 16px"
      : props.size === "large"
      ? "16px 32px"
      : "12px 24px"};
  border: none;
  border-radius: ${(props) => props.borderRadius || "4px"};
  font-size: ${(props) =>
    props.size === "large"
      ? "16px"
      : props.size === "medium"
      ? "14px"
      : "12px"};
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  text-align: center;
  line-height: 1.5;
  transition: all 0.3s ease-in-out;

  ${buttonVariants}

  &:disabled {
    opacity: 0.6;
    pointer-events: none;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid
      ${(props) => props.theme?.colors?.[props.color ?? "text"]?.main || "#000"};
  }

  ${compose(styledColor, layout, space, border, shadow)}
`;

// Button component with support for links and polymorphism
const Button: React.FC<ButtonProps> = ({
  as: Component = "button",
  href,
  children,
  type = "button", // Default to "button" to avoid unintended form submissions
  ...props
}) => {
  // Handle links rendered as buttons
  if (Component === "a" && href) {
    return (
      <StyledButton
        as="a"
        href={href}
        {...props}
        onClick={(e) => props.disabled && e.preventDefault()} // Prevent click if disabled
      >
        {children}
      </StyledButton>
    );
  }

  // Handle buttons or other components
  return (
    <StyledButton as={Component} type={type} {...props}>
      {children}
    </StyledButton>
  );
};

// Default Props
Button.defaultProps = {
  size: "medium",
  color: "primary",
  variant: "contained",
  borderRadius: "4px",
};

export default Button;
