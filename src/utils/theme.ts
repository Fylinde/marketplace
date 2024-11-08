import { deviceSize } from "./constants";
import { colors } from "./themeColors";
import shadows from "./themeShadows";

// Define explicit types for breakpoints
interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
}

// Construct breakpoints as both an object and an array
const breakpoints: Breakpoints = {
  sm: `${deviceSize.sm}px`,
  md: `${deviceSize.md}px`,
  lg: `${deviceSize.lg}px`,
};

// Convert object breakpoints to array format for compatibility with styled-system
const breakpointsArray = Object.values(breakpoints);

// Define the theme object with both array and object formats
export const theme = {
  colors,       // Import colors from themeColors
  shadows,      // Import shadows from themeShadows
  breakpoints: breakpointsArray, // Array for styled-system
  breakpointsObj: breakpoints,   // Object for custom use cases
};

export default theme;
