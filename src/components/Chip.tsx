import styled from "styled-components";
import {
  color,
  ColorProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from "styled-system";

type ChipProps = {
  cursor?: string;
  boxShadow?: string;
};

export const Chip = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "boxShadow", // Filter out boxShadow from the DOM
})<SpaceProps & ColorProps & TypographyProps & PositionProps & ChipProps>`
  display: inline-flex;
  border-radius: 300px;
  cursor: ${(props) => props.cursor || "unset"};
  box-shadow: ${(props) => props.boxShadow || "unset"}; // Use boxShadow here directly
  transition: all 150ms ease-in-out;
  ${space}
  ${color}
  ${position}
  ${typography}
`;

// Usage
// <Chip boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)" />
