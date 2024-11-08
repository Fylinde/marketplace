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

interface ButtonProps extends LayoutProps, SpaceProps { // Extend to include layout and space props
  size?: "small" | "medium" | "large" | "none";
  color?: "primary" | "secondary" | "text" | "error" | "warning";
  variant?: "text" | "outlined" | "contained";
  fullwidth?: boolean;
}

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !["fullwidth", "color", "size", "variant"].includes(prop),
})<
  ColorProps & BackgroundProps & BorderProps & SpaceProps & ButtonProps
>`
  ${(props) => {
    const { color = "text", fullwidth, theme } = props;
    const buttonColor: string =
      theme?.colors?.[color]?.main ?? theme?.colors?.text?.main ?? "#000";

    return `
      display: flex;
      width: ${fullwidth ? "100%" : "unset"};
      justify-content: center;
      align-items: center;
      outline: none;
      border: none;
      cursor: pointer;
      padding: 11px 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: ${buttonColor};
      background: transparent;
      transition: all 150ms ease-in-out;
      line-height: 1;

      &:focus {
        box-shadow: ${theme?.shadows?.[3] ?? "none"};
      }

      &:disabled {
        background-color: ${theme?.colors?.text?.disabled ?? "#ccc"};
        color: ${theme?.colors?.text?.hint ?? "#999"};
        border-color: ${theme?.colors?.text?.disabled ?? "#ccc"};
        cursor: not-allowed;

        svg path {
          fill: ${theme?.colors?.text?.hint ?? "#999"};
        }

        svg polyline, svg polygon {
          color: ${theme?.colors?.text?.hint ?? "#999"};
        }
      }
    `;
  }}

  ${(props) => {
    const { theme, color = "text" } = props;

    return variant({
      prop: "variant",
      variants: {
        text: {
          border: "none",
          color: theme?.colors?.[color]?.main || theme?.colors?.text?.main || "#000",
          "&:hover": {
            backgroundColor: theme?.colors?.[color]?.light || "#f5f5f5",
          },
        },
        outlined: {
          padding: "10px 16px",
          color: theme?.colors?.[color]?.main || theme?.colors?.text?.main || "#000",
          border: "1px solid",
          borderColor: theme?.colors?.[color]?.main || theme?.colors?.text?.disabled || "#ddd",
          "&:enabled svg path": {
            fill: theme?.colors?.[color]?.main || theme?.colors?.text?.main || "#000",
          },
          "&:focus": {
            boxShadow: `0px 1px 4px 0px ${theme?.colors?.[color]?.light || "#ddd"}`,
          },
        },
        contained: {
          color: theme?.colors?.[color]?.text || theme?.colors?.text?.main || "#fff",
          backgroundColor: theme?.colors?.[color]?.main || theme?.colors?.text?.main || "#000",
          "&:focus": {
            boxShadow: `0px 1px 4px 0px ${theme?.colors?.[color]?.light || "#ddd"}`,
          },
          "&:enabled svg path": {
            fill: theme?.colors?.[color]?.text || theme?.colors?.text?.main || "#fff",
          },
        },
      },
    });
  }}

  ${variant({
    prop: "size",
    variants: {
      large: {
        height: "56px",
        paddingLeft: "30px",
        paddingRight: "30px",
      },
      medium: {
        height: "48px",
        paddingLeft: "30px",
        paddingRight: "30px",
      },
      small: {
        height: "40px",
        fontSize: "14px",
      },
    },
  })}

  ${compose(styledColor, layout, space, border, shadow)}
`;

Button.defaultProps = {
  size: "small",
  borderRadius: "5px",
};

export default Button;
