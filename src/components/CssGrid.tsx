import styled from "styled-components";
import {
  compose,
  flexbox,
  FlexboxProps,
  grid,
  GridTemplateColumnsProps,
} from "styled-system";

interface GridProps {
  spacing?: number;
  columnCount?: number;
  gridTemplateColumns?: string;
  xl?: number;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
}

const CssGrid = styled.div<GridProps & GridTemplateColumnsProps & FlexboxProps>(
  ({ gridTemplateColumns, columnCount = 1, spacing = 1 }) => {
    let columnWidth = 100 / (columnCount + 1);  // Fallback to 1 if columnCount is undefined

    return {
      display: "grid",
      gridTemplateColumns:
        gridTemplateColumns ||
        `repeat(auto-fill, minmax(max(${columnWidth}%, 250px), 1fr))`,
      gap: `calc(0.25rem * ${spacing})`, // Fallback to 1 if spacing is undefined
    };
  },
  compose(grid, flexbox)
);

export default CssGrid;
