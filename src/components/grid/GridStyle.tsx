import styled from "styled-components";
import { compose, flexbox } from "styled-system";
import { GridProps } from "./Grid";

const StyledGrid = styled.div<GridProps>((
  {
    container,
    item,
    spacing,
    horizontal_spacing,
    vertical_spacing,
    xl,
    lg,
    md,
    sm,
    xs,
    containerHeight,
  }) => {

    // Define mediaProps with explicit types
    let mediaProps: Record<"xl" | "lg" | "md" | "sm" | "xs", number | undefined> = { xl, lg, md, sm, xs };

    // Define the style object
    let style: any = {};

    if (container) {
      style = {
        display: "flex",
        flexWrap: "wrap",
        height: containerHeight,
        margin: spacing ? `-${(spacing / 2) * 0.25}rem` : "unset",
      };

      if (horizontal_spacing) {
        style.marginLeft = `-${(horizontal_spacing / 2) * 0.25}rem`;
        style.marginRight = `-${(horizontal_spacing / 2) * 0.25}rem`;
      }

      if (vertical_spacing) {
        style.marginTop = `-${(vertical_spacing / 2) * 0.25}rem`;
        style.marginBottom = `-${(vertical_spacing / 2) * 0.25}rem`;
      }

    } else if (item) {

      if (spacing) style.padding = `${(spacing / 2) * 0.25}rem`;

      if (horizontal_spacing) {
        style.paddingLeft = `${(horizontal_spacing / 2) * 0.25}rem`;
        style.paddingRight = `${(horizontal_spacing / 2) * 0.25}rem`;
      }

      if (vertical_spacing) {
        style.paddingTop = `${(vertical_spacing / 2) * 0.25}rem`;
        style.paddingBottom = `${(vertical_spacing / 2) * 0.25}rem`;
      }

      // Use correct typing for key
      for (const key in mediaSize) {
        const sizeKey = key as keyof typeof mediaProps;

        if (mediaProps[sizeKey]) {
          style = {
            ...style,
            [`@media only screen and (min-width: ${mediaSize[sizeKey]}px)`]: {
              width: `${(mediaProps[sizeKey]! / 12) * 100}%`, // Added '!' to assert the value exists
            },
          };
        }
      }
    }

    return style;
  },
  compose(flexbox)
);

const mediaSize = {
  xs: 0,
  sm: 426,
  md: 769,
  lg: 1025,
  xl: 1441,
};

export default StyledGrid;
