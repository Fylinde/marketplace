import { themeGet } from "@styled-system/theme-get";
import { differenceInMinutes } from "date-fns";
import { ceil } from "lodash";

export const getTheme = (query: string, fallback: string = "#000") => 
    themeGet(query, fallback);

export const convertHexToRGB = (hex: string) => {
  if (typeof hex !== "string" || !hex) return "0, 0, 0"; // Fallback to black
  if (hex.match("rgba")) {
    return hex.slice(5).split(",").slice(0, -1).join(",");
  }
  
  let colorArray;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    colorArray = hex.substring(1).split("");
    if (colorArray.length === 3) {
      colorArray = [colorArray[0], colorArray[0], colorArray[1], colorArray[1], colorArray[2], colorArray[2]];
    }
    const c = parseInt(colorArray.join(""), 16);
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",");
  }
  return "0, 0, 0"; // Fallback for invalid hex input
};

export const getDateDifference = (date: string | number | Date) => {
  if (!date || isNaN(new Date(date).getTime())) return "Invalid date";
  let diff = differenceInMinutes(new Date(), new Date(date));
  if (diff < 60) return diff + " minutes ago";

  diff = ceil(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 1 ? "" : "s"} ago`;

  diff = ceil(diff / 24);
  if (diff < 30) return `${diff} day${diff === 1 ? "" : "s"} ago`;

  diff = ceil(diff / 30);
  if (diff < 12) return `${diff} month${diff === 1 ? "" : "s"} ago`;

  diff = diff / 12;
  return `${diff.toFixed(1)} year${ceil(diff) === 1 ? "" : "s"} ago`;
};
