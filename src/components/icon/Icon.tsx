import React, { ButtonHTMLAttributes, useState } from "react";
import { SpaceProps } from "styled-system";
import { colorOptions } from "interfaces";
import StyledIcon from "./IconStyle";
import { ReactNode } from "react";

export interface IconProps {
  size?: string;
  children: ReactNode;
  transform?: string;
  variant?: "small" | "medium" | "large";
  color?: colorOptions;
  defaultcolor?: "currentColor" | "auto";
}

const Icon: React.FC<IconProps & SpaceProps & ButtonHTMLAttributes<IconProps>> = ({
  children,
  variant = "medium",          // Set default for variant here
  defaultcolor = "currentColor", // Set default for defaultcolor here
  ...props
}: IconProps) => {
  const [hasError, setHasError] = useState(false);

  const iconName = typeof children === "string" ? children : children?.toString().trim();
  const handleError = () => setHasError(true);

  return (
    <StyledIcon {...props}>
      {!hasError ? (
        <img
          src={`/assets/images/icons/${iconName}.svg`}
          onError={handleError}
          alt={iconName}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <span>{iconName}</span>
      )}
    </StyledIcon>
  );
};

export default Icon;
