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

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> &
  BorderProps &
  SpaceProps &
  ColorProps & {
    fallbackSrc?: string; // Optional fallback image source
  };

const StyledImage = styled.img<LazyImageProps>`
  display: block;
  ${color}
  ${space}
  ${border}
`;

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = "image",
  fallbackSrc = "/assets/images/default-image.png", // Provide a default fallback
  ...props
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackSrc; // Replace broken image with fallback
  };

  return <StyledImage src={src} alt={alt} onError={handleError} {...props} />;
};

export default LazyImage;
