import React, { useEffect, useState } from "react";
import { colors } from "../../utils/themeColors"; // Import your colors

export interface StarProps {
  value?: number;
  outof?: number;
  color?: keyof typeof colors;  // Ensure color is one of the keys in colors
  onClick?: () => void;
}

const Star: React.FC<StarProps> = ({ value = 0, outof = 5, color = 'default', ...props }) => {
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    setId(Math.random());
  }, []);

  // Helper function to get color main or fallback to some other value
  const getColorMain = (colorKey: keyof typeof colors) => {
    const colorEntry = colors[colorKey];

    // Check if colorEntry has 'main' or numbered properties like '500'
    if (typeof colorEntry === "object" && 'main' in colorEntry) {
      return colorEntry.main;
    } else if (typeof colorEntry === "object" && '500' in colorEntry) {
      return colorEntry[500];
    }

    return "currentColor";  // Fallback to currentColor if no match
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={`url(#star-${id})`}
      stroke={getColorMain(color)}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-star"
      {...props}
    >
      <defs>
        <linearGradient id={`star-${id}`}>
          <stop offset={value / outof} stopColor={getColorMain(color)} />
          <stop
            offset={value / outof}
            stopColor={colors.body.paper || "white"}  // Fallback to white if not found
            stopOpacity="1"
          />
        </linearGradient>
      </defs>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

Star.defaultProps = {
  outof: 5,
  value: 0,
  color: "secondary",
};

export default Star;
