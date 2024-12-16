import styled, { css } from "styled-components";

export const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block; /* Allows wrapping around inline elements */
  cursor: pointer;
`;

export const TooltipBubble = styled.div<{ position: "top" | "bottom" | "left" | "right" }>`
  position: absolute;
  ${({ position }) =>
    position === "top" &&
    css`
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
    `}
  ${({ position }) =>
    position === "bottom" &&
    css`
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
    `}
  ${({ position }) =>
    position === "left" &&
    css`
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
    `}
  ${({ position }) =>
    position === "right" &&
    css`
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
    `}
  background: ${({ theme }) => theme.colors.body.paper || "#333"}; /* Dynamic theme support */
  color: ${({ theme }) => theme.colors.body.text || "#fff"};
  border-radius: 4px;
  padding: 8px 12px;
  white-space: nowrap; /* Prevents text wrapping */
  z-index: 1000;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  /* Animation */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;

  ${TooltipWrapper}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

export const TooltipContent = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;
