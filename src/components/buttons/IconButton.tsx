import systemCss from "@styled-system/css";
import styled from "styled-components";
import {
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  layout,
  shadow,
  space,
  SpaceProps,
  variant,
} from "styled-system";

interface IconButtonProps {
  size: "small" | "medium" | "large" | "none";
  variant: "text" | "outlined" | "contained";
  color: "primary" | "secondary" | "error" | "default"; // These should be the valid color keys in your theme
}

const IconButton = styled.button<
  ColorProps | BackgroundProps | BorderProps | SpaceProps | IconButtonProps
>(
  systemCss({
    outline: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    borderRadius: 500,
    padding: "1rem",
    fontWeight: 600,
    color: "inherit",
    transition: "all 150ms ease-in-out",
    bg: "body.paper",
    "&:hover": {
      bg: "gray.200",
    },
    "&:disabled": {
      bg: "text.disabled",
      color: "text.muted",
    },
  }),
  (props) =>
    variant({
      prop: "variant",
      variants: {
        text: {
          border: "none",
          color: `${props.theme.colors[props.color ?? "default"]?.main}`, // Fallback to "default"
        },
        outlined: {
          color: `${props.theme.colors[props.color ?? "default"]?.main}`, // Fallback to "default"
          border: "2px solid",
          borderColor: `${props.theme.colors[props.color ?? "default"]?.main}`, // Fallback to "default"
          "&:focus": {
            boxShadow: `0px 1px 4px 0px ${
              props.theme.colors[props.color ?? "default"]?.main // Fallback to "default"
            }`,
          },
        },
        contained: {
          border: "none",
          color: `${props.theme.colors[props.color ?? "default"]?.text}`, // Fallback to "default"
          bg: `${props.theme.colors[props.color ?? "default"]?.main}`, // Fallback to "default"
          "&:hover": {
            bg: `${props.theme.colors[props.color ?? "default"]?.main}`, // Fallback to "default"
          },
          "&:focus": {
            boxShadow: `0px 1px 4px 0px ${
              props.theme.colors[props.color ?? "default"]?.main // Fallback to "default"
            }`,
          },
        },
      },
    }),
  variant({
    prop: "size",
    variants: {
      large: {
        padding: "1.25rem",
      },
      medium: {
        padding: "1rem",
      },
      small: {
        padding: "0.75rem",
        fontSize: 14,
      },
    },
  }),
  compose(color, layout, space, border, shadow)
);

IconButton.defaultProps = {
  size: "small",
  color: "default", // Add a default color to avoid undefined
};

export default IconButton;
