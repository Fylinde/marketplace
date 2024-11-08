import React, { useEffect, useState } from "react";
import StyledRating from "./RatingStyle";
import Star from "./Star";
import { colors } from "../../utils/themeColors";

export interface RatingProps {
  value?: number;
  outof?: number;
  readonly?: boolean;
  color?: keyof typeof colors;
  className?: string;
  style?: React.CSSProperties;
  size?: "small" | "medium" | "large";
  onChange?: (value: number) => void;
  count?: number;
  onRate?: (newRating: number) => void; // Add onRate as an optional prop
}

// Define valid color options directly within Rating for simplicity
const validColors = [
  "primary", "secondary", "warn", "error", "success", "text", "body", "gray", "default",
] as const;
type ValidColor = (typeof validColors)[number];

// Helper to verify color input validity
const getValidColor = (color: ValidColor | undefined): ValidColor => {
  return validColors.includes(color as ValidColor) ? (color as ValidColor) : "default";
};

// Define types for specific color structures in colors
type GrayColor = {
  900: string;
  800: string;
  700: string;
  600: string;
  500: string;
  400: string;
  300: string;
  200: string;
  100: string;
  white: string;
};

type ColorWithMain = {
  main: string;
  light?: string;
  dark?: string;
};

// Helper to check if color is of type GrayColor
const isGrayColor = (color: any): color is GrayColor => {
  return color && typeof color === "object" && "700" in color;
};

// Helper to check if color has a "main" property
const isColorWithMain = (color: any): color is ColorWithMain => {
  return color && typeof color === "object" && "main" in color;
};

// Helper function to get the correct color
const getColor = (validColor: ValidColor): string => {
  const colorObj = colors[validColor];

  if (isColorWithMain(colorObj)) {
    return colorObj.main; // Use main if it exists
  }

  if (validColor === "gray" && isGrayColor(colorObj)) {
    return colorObj[700]; // Use gray[700] if it exists
  }

  // Check if colorObj is a string, otherwise fall back
  return typeof colorObj === "string" ? colorObj : colors.gray[700];
};

const Rating: React.FC<RatingProps> = ({
  value = 0,
  color,
  outof = 5,
  readonly = true,
  onChange,
  count,
  onRate, // Include onRate in destructuring
  ...props
}) => {
  const [state, setState] = useState<number>(value);
  const validColor = getValidColor(color);
  const textColor = getColor(validColor); // Get the appropriate color

  useEffect(() => {
    setState(value);
  }, [value]);

  // Define star list rendering
  const renderStars = () => {
    const fullStars = Math.floor(state);
    const halfStars = Math.ceil(state - fullStars);
    const emptyStars = outof - Math.ceil(state);

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={i} value={10} color={validColor} onClick={() => handleStarClick(i + 1)} />
        ))}
        {halfStars > 0 && (
          <Star
            key={fullStars}
            value={(state - fullStars) * 10}
            outof={10}
            color={validColor}
            onClick={() => handleStarClick(fullStars + 1)}
          />
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star
            key={i + fullStars + halfStars}
            value={0}
            color={validColor}
            onClick={() => handleStarClick(i + fullStars + halfStars + 1)}
          />
        ))}
      </>
    );
  };

  const handleStarClick = (inputValue: number) => {
    if (!readonly) {
      setState(inputValue);
      if (onChange) onChange(inputValue);
      if (onRate) onRate(inputValue); // Call onRate if defined
    }
  };

  return (
    <StyledRating color={validColor} value={state} readonly={readonly} {...props}>
      {renderStars()}
      {/* Display the count if provided */}
      {count !== undefined && (
        <span style={{ marginLeft: 8, fontSize: "0.875em", color: textColor }}>
          ({count} ratings)
        </span>
      )}
    </StyledRating>
  );
};

export default Rating;
