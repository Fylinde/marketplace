import React from "react";
import Button from "../buttons/Button";
import Typography from "../Typography";
import { StyledCarouselCard1 } from "./CarouselCardStyle";

export interface CarouselCard1Props {
  title: string;
  image: string; // Assuming 'image' is the main image property
  link: string;
  description: string;
  subtitle?: string; // Optional subtitle
  buttonText?: string; // Optional button text
  buttonLink?: string; // Optional button link
  imageUrl?: string; // Optional secondary image
}


const CarouselCard1: React.FC<CarouselCard1Props> = ({
  title = "50% Off For Your First Shopping",
  image,
  link,
  description,
  subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis consequat eu, quam etiam at quis ut convallis.",
  buttonText = "Visit Collections",
  buttonLink = "#",
  imageUrl = "/assets/images/products/apple-watch-0.png",
}) => {
  return (
    <StyledCarouselCard1>
      {/* Text Section */}
      <div className="text-content">
        <h1 className="title">{title}</h1>
        <Typography color="secondary.main" mb="1.35rem">
          {subtitle}
        </Typography>
        <Button
          className="button-link"
          variant="contained"
          color="primary"
          p="1rem 1.5rem"
          onClick={() => window.location.href = buttonLink}
        >
          {buttonText}
        </Button>
      </div>

      {/* Image Section */}
      <div className="image-holder">
        <img
          src={imageUrl}
          alt={title}
          className="carousel-image"
        />
      </div>
    </StyledCarouselCard1>
  );
};

export default CarouselCard1;
