import styled, { keyframes } from "styled-components";
import { themeGet } from "@styled-system/theme-get";
import { LinearProgressProps } from "./LinearProgress";
import { color } from "styled-system";

// Animation for smooth progress transitions
const progressAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const StyledLinearProgress = styled.div<LinearProgressProps>`
  position: relative;
  display: flex;
  align-items: center;
  height: ${(props) => props.thickness}px;
  background-color: ${themeGet("colors.gray.300")};
  border-radius: ${(props) => props.thickness}px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  // Progress bar fill
  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: ${(props) => props.value}%; // Access value from props
    background: linear-gradient(
      90deg,
      ${(props) => themeGet(`colors.${props.color}.light`)(props)}, // Correctly access props
      ${(props) => themeGet(`colors.${props.color}.main`)(props)}
    );
    transition: width 0.3s ease-in-out; // Smooth transition
  }

  // Optional label inside the progress bar
  span {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: ${themeGet("colors.text.primary")};
    z-index: 1;
  }

  ${color}
`;

export default StyledLinearProgress;
