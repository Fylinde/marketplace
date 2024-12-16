import Card from "components/Card";
import React from "react";
import  Typography  from "components/Typography";
import styled from "styled-components";
import { getTheme } from "utils/utils";

export interface CarouselCard2Props {
  text?: string; // Dynamic content
  bgColor?: string; // Background color
  textColor?: string; // Text color
  padding?: string; // Custom padding
  link?: string; // Optional link for interactivity
}

const StyledCarouselCard2 = styled(Card)<{
  bgColor?: string;
  textColor?: string;
}>`
  background-color: ${({ bgColor }) =>
    bgColor || getTheme("colors.primary.main")};
  color: ${({ textColor }) => textColor || getTheme("colors.primary.text")};
  text-align: center;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CarouselCard2: React.FC<CarouselCard2Props> = ({
  text = "Default Carousel Card Text",
  bgColor,
  textColor,
  padding = "40px 72px",
  link,
}) => {
  const content = (
    <Typography fontWeight="600" fontSize="1.25rem">
      {text}
    </Typography>
  );

  return (
    <StyledCarouselCard2 p={padding} bgColor={bgColor} textColor={textColor}>
      {link ? <a href={link}>{content}</a> : content}
    </StyledCarouselCard2>
  );
};

export default CarouselCard2;
