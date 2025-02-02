import React from "react";
import Button from "../buttons/Button";
import Typography from "../Typography";
import { StyledCarouselCard1 } from "./CarouselCardStyle";

export interface CarouselCard1Props {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const CarouselCard1: React.FC<CarouselCard1Props> = ({
  title,
  description,
  image,
  buttonText,
  buttonLink,
}) => {
  return (
    <StyledCarouselCard1>
      <div className="text-content">
        <h1 className="title">{title}</h1>
        <Typography color="secondary.main" mb="1rem">
          {description}
        </Typography>
        <Button
          className="button-link"
          variant="contained"
          color="primary"
          p="1rem 1.5rem"
          onClick={(e) => {
            e.stopPropagation();
            window.open(buttonLink, "_blank");
          }}
        >
          {buttonText}
        </Button>
      </div>

      <div className="image-holder">
        <img src={image} alt={title} className="carousel-image" />
      </div>
    </StyledCarouselCard1>
  );
};

export default CarouselCard1;
