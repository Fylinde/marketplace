import React from "react";
import styled, { keyframes } from "styled-components";

interface CircularProgressProps {
  size?: number; // Diameter of the spinner
  thickness?: number; // Thickness of the spinner ring
  color?: string; // Primary color of the spinner
  trackColor?: string; // Background ring color
  ariaLabel?: string; // Accessibility label
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div<CircularProgressProps>`
  display: inline-block;
  position: relative;
  width: ${(props) => props.size || 40}px;
  height: ${(props) => props.size || 40}px;

  &::after {
    content: " ";
    display: block;
    width: ${(props) => props.size || 40}px;
    height: ${(props) => props.size || 40}px;
    margin: 1px;
    border: ${(props) => props.thickness || 4}px solid
      ${(props) => props.color || "#3498db"};
    border-radius: 50%;
    border-color: ${(props) => props.color || "#3498db"}
      ${(props) => props.trackColor || "transparent"}
      ${(props) => props.trackColor || "transparent"}
      ${(props) => props.trackColor || "transparent"};
    animation: ${spin} 1.2s linear infinite;
  }
`;

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 40,
  thickness = 4,
  color = "#3498db",
  trackColor = "transparent",
  ariaLabel = "Loading...",
}) => {
  return (
    <Spinner
      size={size}
      thickness={thickness}
      color={color}
      trackColor={trackColor}
      role="status"
      aria-label={ariaLabel}
    />
  );
};

export default CircularProgress;
