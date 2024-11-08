import React from "react"; 
import styled from "styled-components";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  space,
  SpaceProps,
} from "styled-system";

// Define LazyImageProps with alt prop as required
type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> &
  BorderProps &
  SpaceProps &
  ColorProps;

const LazyImage = styled(({ borderRadius, alt, ...props }: LazyImageProps) => {
  // Ensure alt prop is always present by providing a default empty string if none is provided
  return <img alt={alt || ""} {...props} />;
})<LazyImageProps>`
  display: block;

  ${color}
  ${space}
  ${border}
`;

export default LazyImage;
