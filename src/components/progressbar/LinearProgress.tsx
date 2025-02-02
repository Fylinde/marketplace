import React from "react";
import StyledLinearProgress from "./LinearProgressStyle";

export interface LinearProgressProps {
  variant?: "determinate" | "indeterminate";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "dynamic";
  value?: number; // Progress percentage
  thickness?: number; // Thickness of the progress bar
  label?: string; // Optional label for the progress bar
  showValue?: boolean; // Display the percentage value
  style?: React.CSSProperties; // Custom styles
}

const LinearProgress: React.FC<LinearProgressProps> = ({
  variant = "determinate",
  color = "primary",
  value = 0,
  thickness = 6,
  label,
  showValue = false,
  style,
}) => {
  const progressValue = Math.min(Math.max(value || 0, 0), 100); // Clamp value between 0 and 100

  // Determine dynamic color based on progress percentage
  const dynamicColor =
    color === "dynamic"
      ? progressValue < 30
        ? "error"
        : progressValue < 70
        ? "warning"
        : "success"
      : color;

  return (
    <div style={{ ...style, textAlign: "center", margin: "1rem 0" }}>
      {/* Progress Label */}
      {label && (
        <p
          style={{
            marginBottom: "0.5rem",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#2b3445",
          }}
        >
          {label}
        </p>
      )}

      {/* Progress Bar */}
      <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
        <StyledLinearProgress
          variant={variant}
          color={dynamicColor}
          value={progressValue}
          thickness={thickness}
        />
        {showValue && variant === "determinate" && (
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#FFFFFF",
            }}
          >
            {progressValue}%
          </span>
        )}
      </div>
    </div>
  );
};

export default LinearProgress;
