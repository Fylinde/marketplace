import styled from "styled-components";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  flex,
  flexbox,
  FlexboxProps,
  FlexProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from "styled-system";

// Extended BoxProps to include more customization options
type BoxProps = {
  shadow?: number; // Custom shadow level
  cursor?: string; // Cursor style
  transition?: string; // Transition for animations
  gap?: string | number; // Gap for flex/grid layouts
  as?: keyof JSX.IntrinsicElements; // Element type for polymorphic support
} & LayoutProps &
  ColorProps &
  PositionProps &
  SpaceProps &
  FlexProps &
  BorderProps &
  FlexboxProps &
  TypographyProps &
  GridProps &
  ShadowProps; // Added grid and shadow props for advanced layouts

// Styled component
const Box = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["shadow", "gap", "transition", "cursor"].includes(prop), // Prevent custom props from being forwarded to DOM
})<BoxProps>(
  ({ shadow = 0, cursor = "unset", transition, gap, theme }) => {
    const boxShadow =
      theme.shadows && theme.shadows[shadow] ? theme.shadows[shadow] : "none";

    return {
      boxShadow,
      cursor,
      transition,
      gap, // Apply gap for flex/grid layouts
    };
  },
  compose(layout, space, color, position, flexbox, flex, border, typography, grid, shadow)
);

Box.defaultProps = {
  shadow: 0, // Default shadow
  cursor: "unset", // Default cursor
  transition: "all 0.3s ease-in-out", // Smooth transition
};

export default Box;
