import React, { ButtonHTMLAttributes, useState } from "react";
import { SpaceProps } from "styled-system";
import { colorOptions } from "interfaces";
import StyledIcon from "./IconStyle";
import ReactSVG from "react-svg";
import { ReactNode } from "react";

export interface IconProps {
  size?: string;
  children: ReactNode; // Allow ReactNode (JSX, strings, elements, etc.)
  transform?: string;
  variant?: "small" | "medium" | "large";
  color?: colorOptions;
  defaultcolor?: "currentColor" | "auto";
}

const Icon: React.FC<
  IconProps & SpaceProps & ButtonHTMLAttributes<IconProps>
> = ({ children, ...props }: IconProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  // Convert children to a string to ensure it's passed correctly
  const iconName = typeof children === 'string' ? children : children?.toString().trim();

  return (
    <StyledIcon
      {...props}
      src={`/assets/images/icons/${iconName}.svg`} // Pass `src` to StyledIcon
    >
      {!hasError ? (
        <ReactSVG
          src={`/assets/images/icons/${iconName}.svg`} // Use iconName for the SVG path
          onError={handleError} // Handle errors
        />
      ) : (
        <span>{iconName}</span> // Fallback if SVG fails to load
      )}
    </StyledIcon>
  );
};

Icon.defaultProps = {
  variant: "medium",
  defaultcolor: "currentColor",
};

export default Icon;
