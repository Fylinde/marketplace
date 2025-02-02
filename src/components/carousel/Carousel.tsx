import clsx from "clsx";
import { colorOptions } from "../../interfaces";
import {
  ButtonBack,
  ButtonNext,
  DotGroup,
  Slide,
  Slider,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import React, { Fragment, useEffect, useState } from "react";
import { CSSProperties } from "styled-components";
import IconButton from "../buttons/IconButton";
import Icon from "../icon/Icon";
import { StyledCarousel } from "./CarouselStyle";

export interface CarouselProps {
  naturalSlideWidth?: number;
  naturalSlideHeight?: number;
  totalSlides?: number;
  visibleSlides?: number;
  currentSlide?: number;
  isIntrinsicHeight?: boolean;
  hasMasterSpinner?: boolean;
  infinite?: boolean;
  autoPlay?: boolean | { delay: number; pauseOnHover: boolean };
  keyboardNavigation?: boolean;
  swipeNavigation?: boolean;
  transitionEffect?: "slide" | "fade";
  animationSpeed?: number;
  step?: number;
  interval?: number;
  showDots?: boolean;
  showArrow?: boolean;
  showArrowOnHover?: boolean;
  dotClass?: string;
  dotColor?: string;
  dotGroupMarginTop?: string;
  spacing?: string;
  arrowButtonColor?: colorOptions;
  arrowButtonClass?: string;
  leftButtonClass?: string;
  rightButtonClass?: string;
  leftButtonStyle?: CSSProperties;
  rightButtonStyle?: CSSProperties;
  children?: React.ReactNode;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  naturalSlideWidth,
  naturalSlideHeight,
  totalSlides,
  visibleSlides,
  currentSlide,
  isIntrinsicHeight,
  hasMasterSpinner,
  infinite,
  autoPlay,
  keyboardNavigation,
  swipeNavigation,
  transitionEffect = "slide",
  animationSpeed = 500,
  step,
  interval,
  showDots,
  showArrow,
  showArrowOnHover,
  dotClass,
  dotColor,
  dotGroupMarginTop,
  spacing,
  arrowButtonClass,
  arrowButtonColor,
  leftButtonClass,
  rightButtonClass,
  leftButtonStyle,
  rightButtonStyle,
}) => {
  const [isPlaying, setIsPlaying] = useState(
    typeof autoPlay === "boolean" ? autoPlay : autoPlay?.delay ? autoPlay.delay > 0 : false
  );
  

  const handleKeyDown = (event: KeyboardEvent) => {
    if (keyboardNavigation) {
      if (event.key === "ArrowLeft") {
        (ButtonBack as any)?.props?.onClick();
      } else if (event.key === "ArrowRight") {
        (ButtonNext as any)?.props?.onClick();
      }
    }
  };

  useEffect(() => {
    if (keyboardNavigation) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [keyboardNavigation]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (typeof autoPlay === "object" && isPlaying) {
      timer = setInterval(() => {
        (ButtonNext as any)?.props?.onClick();
      }, autoPlay.delay);
    }
    return () => clearInterval(timer);
  }, [autoPlay, isPlaying]);

  return (
    <StyledCarousel
      naturalSlideWidth={naturalSlideWidth}
      naturalSlideHeight={naturalSlideHeight}
      totalSlides={totalSlides}
      visibleSlides={visibleSlides}
      isIntrinsicHeight={isIntrinsicHeight}
      hasMasterSpinner={hasMasterSpinner}
      infinite={infinite}
      isPlaying={isPlaying}
      transitionEffect={transitionEffect}
      animationSpeed={animationSpeed}
      dotColor={dotColor}
      dotGroupMarginTop={dotGroupMarginTop}
      spacing={spacing}
      showDots={showDots}
      currentSlide={currentSlide}
      onMouseEnter={
        typeof autoPlay === "object" && autoPlay.pauseOnHover
          ? () => setIsPlaying(false)
          : undefined
      }
      onMouseLeave={
        typeof autoPlay === "object" && autoPlay.pauseOnHover
          ? () => setIsPlaying(true)
          : undefined
      }
      swipeable={swipeNavigation}
      showArrowOnHover={showArrowOnHover}
    >
      <Slider className={`custom-slider ${transitionEffect}`}>
        {React.Children.map(children, (child, ind) => (
          <Slide index={ind}>{child}</Slide>
        ))}
      </Slider>

      {showDots && (
        <DotGroup
          className={`custom-dot ${dotClass}`}
          renderDots={(props: any) => renderDots({ ...props, step })}
        />
      )}

      {showArrow && (
        <Fragment>
          <IconButton
            className={`arrow-button left-arrow-class ${arrowButtonClass} ${leftButtonClass}`}
            as={ButtonBack}
            variant="contained"
            color={arrowButtonColor}
            style={leftButtonStyle || {}}
          >
            <Icon variant="small" defaultcolor="currentColor">
              arrow-left
            </Icon>
          </IconButton>
          <IconButton
            className={`arrow-button right-arrow-class ${arrowButtonClass} ${rightButtonClass}`}
            as={ButtonNext}
            variant="contained"
            color={arrowButtonColor}
            style={rightButtonStyle || {}}
          >
            <Icon variant="small" defaultcolor="currentColor">
              arrow-right
            </Icon>
          </IconButton>
        </Fragment>
      )}
    </StyledCarousel>
  );
};

interface RenderDotsProps {
  step: number;
  currentSlide: number;
  visibleSlides: number;
  totalSlides: number;
  carouselStore: any;
}

const renderDots = ({
  step,
  currentSlide,
  visibleSlides,
  totalSlides,
  carouselStore,
}: RenderDotsProps) => {
  const dots = [];
  const total = totalSlides - visibleSlides + 1;

  for (let i = 0; i < total; i += step) {
    dots.push(
      <div
        key={i}
        className={clsx({
          dot: true,
          "dot-active": currentSlide === i,
        })}
        onClick={() =>
          carouselStore.setStoreState({
            currentSlide: i,
            autoPlay: false,
          })
        }
      />
    );
  }
  return dots;
};

Carousel.defaultProps = {
  naturalSlideWidth: 100,
  naturalSlideHeight: 125,
  totalSlides: 10,
  visibleSlides: 5,
  isIntrinsicHeight: true,
  hasMasterSpinner: false,
  infinite: false,
  autoPlay: false,
  keyboardNavigation: true,
  swipeNavigation: true,
  step: 1,
  interval: 2000,
  showDots: false,
  showArrow: true,
  transitionEffect: "slide",
  animationSpeed: 500,
  dotGroupMarginTop: "2rem",
  spacing: "1.5rem",
  arrowButtonColor: "secondary",
};

export default Carousel;
