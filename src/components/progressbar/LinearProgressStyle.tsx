import styled, { keyframes } from "styled-components";
import { LinearProgressProps } from "./LinearProgress";

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
  height: ${(props) => props.thickness || 6}px; /* Default to 6px */
  background-color: #e0e0e0; /* Light gray for the background bar */
  border-radius: ${(props) => props.thickness || 6}px; /* Rounded corners */
  overflow: hidden;
  width: 100%; /* Full width */
  max-width: 800px; /* Limit maximum width */
  margin: 0 auto; /* Center-align */

  /* Progress bar fill */
  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: ${(props) => props.value || 0}%; /* Dynamic progress width */
    background: linear-gradient(
      90deg,
      rgba(74, 144, 226, 1),
      rgba(0, 123, 255, 1)
    ); /* Beautiful gradient */
    transition: width 0.4s ease-in-out; /* Smooth animation */
    border-radius: ${(props) => props.thickness || 6}px; /* Same rounded corners */
  }

  /* Optional text inside the progress bar */
  span {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #ffffff; /* White text */
    z-index: 1;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    height: ${(props) => (props.thickness ? props.thickness / 1.5 : 4)}px;
  }

  @media (max-width: 480px) {
    max-width: 100%; /* Full width on very small screens */
    height: ${(props) => (props.thickness ? props.thickness / 2 : 3)}px;
  }
`;

export default StyledLinearProgress;
