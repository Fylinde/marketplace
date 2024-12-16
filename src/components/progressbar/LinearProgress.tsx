import { colorOptions } from "interfaces";
import React from "react";
import StyledLinearProgress from "./LinearProgressStyle";

export interface LinearProgressProps {
  variant?: "determinate" | "indeterminate";
  color?: "primary" | "secondary" | "success" | "error" | "warning";
  value?: number; // Progress percentage
  thickness?: number; // Thickness of the progress bar
  label?: string; // Optional label for the progress bar
  style?: React.CSSProperties; // Custom styles
}


const LinearProgress: React.FC<LinearProgressProps> = ({
  variant = "determinate",
  color = "primary",
  value = 0,
  thickness = 6,
  label,
  style,
}) => {
  const progressValue = Math.min(Math.max(value || 0, 0), 100); // Clamp value between 0 and 100

  return (
    <div style={{ ...style, textAlign: "center", margin: "1rem 0" }}>
      {/* Progress Label */}
      {label && <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>{label}</p>}

      {/* Progress Bar */}
      <StyledLinearProgress
        variant={variant}
        color={color}
        value={progressValue}
        thickness={thickness}
      />
    </div>
  );
};


LinearProgress.defaultProps = {
  variant: "determinate",
  color: "primary",
  thickness: 6,
  value: 75,
};

export default LinearProgress;
