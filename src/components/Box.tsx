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
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from "styled-system";

type BoxProps = {
  shadow?: number;
  cursor?: string;
  transition?: string;
};

const Box = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "shadow", // Exclude shadow from DOM
})<
  BoxProps &
    LayoutProps &
    ColorProps &
    PositionProps &
    SpaceProps &
    FlexProps &
    BorderProps &
    FlexboxProps &
    TypographyProps
>(
  ({ shadow = 0, cursor = "unset", transition, theme }) => {
    const boxShadow = theme.shadows && theme.shadows[shadow] ? theme.shadows[shadow] : "none";

    return {
      boxShadow,
      cursor,
      transition,
    };
  },
  compose(layout, space, color, position, flexbox, flex, border, typography)
);

Box.defaultProps = {
  shadow: 0,
  cursor: "unset",
};

export default Box;
