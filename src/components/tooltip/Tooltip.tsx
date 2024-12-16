import React, { useState, useRef } from "react";
import { TooltipWrapper, TooltipBubble, TooltipContent } from "./StyledTooltip";

type TooltipProps = {
  content: React.ReactNode; // The tooltip content
  position?: "top" | "bottom" | "left" | "right"; // Position of the tooltip
  children: React.ReactNode; // The wrapped element
  delay?: number; // Delay before showing the tooltip (ms)
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  children,
  delay = 200,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <TooltipWrapper onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {visible && (
        <TooltipBubble position={position}>
          <TooltipContent>{content}</TooltipContent>
        </TooltipBubble>
      )}
    </TooltipWrapper>
  );
};

export default Tooltip;
