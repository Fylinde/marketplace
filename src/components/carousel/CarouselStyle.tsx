import styled from "styled-components";
import { deviceSize } from "utils/constants";
import { getTheme } from "../../utils/utils";
import { CarouselProvider } from "pure-react-carousel";
import React from "react";

type CarouselProviderProps = React.ComponentProps<typeof CarouselProvider>;

type StyledCarouselProps = {
  showDots?: boolean;
  showArrowOnHover?: boolean;
  dotColor?: string;
  dotGroupMarginTop?: string;
  spacing?: string;
  children?: React.ReactNode;
};

export const StyledCarousel = styled(
  ({
    spacing,
    showDots,
    showArrowOnHover,
    dotGroupMarginTop,
    dotColor,
    children,
    ...props
  }: CarouselProviderProps & StyledCarouselProps) => (
    <CarouselProvider {...props}>{children}</CarouselProvider>
  )
)`
  position: relative;
  min-width: 0px;

  /* Slider Section */
  .custom-slider {
    margin-left: calc(-1 * ${({ spacing }) => spacing || "0px"} / 2);
    margin-right: calc(-1 * ${({ spacing }) => spacing || "0px"} / 2);
    scroll-behavior: smooth;
  }

  .carousel__inner-slide {
    margin: auto;
    width: calc(100% - ${({ spacing }) => spacing || "0px"});
    transition: transform 0.5s ease-in-out;
  }

  /* Arrow Buttons */
  .arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    background-color: ${getTheme("colors.primary.main")};
    color: ${getTheme("colors.primary.text")};
    border-radius: 50%;
    transition: all 0.3s ease;
    z-index: 10;

    &:hover {
      background-color: ${getTheme("colors.primary.dark")};
      transform: translateY(-50%) scale(1.1);
    }

    &:focus {
      outline: 2px solid ${getTheme("colors.primary.light")};
    }

    &[aria-label] {
      cursor: pointer;
    }
  }

  .right-arrow-class {
    right: -32px;
  }

  .left-arrow-class {
    left: -32px;
  }

  /* Arrow Visibility on Hover */
  ${(props) =>
    props.showArrowOnHover &&
    `
    [class*="arrow-class"] {
      display: none;
    }

    :hover {
      [class*="arrow-class"] {
        display: block;
      }
    }

    @media only screen and (max-width: ${deviceSize.sm}px) {
      [class*="arrow-class"] {
        display: block;
      }
    }
  `}

  /* Dot Group */
  .custom-dot {
    display: flex;
    justify-content: center;
    margin-top: ${(props) => props.dotGroupMarginTop || "1rem"};
    align-items: center;
  }

  /* Dot Styling */
  .dot {
    position: relative;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    margin: 0.5rem;
    cursor: pointer;
    border: 2px solid
      ${({ dotColor }) => dotColor || getTheme("colors.secondary.main")};
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
    }

    &:focus {
      outline: 2px solid ${getTheme("colors.secondary.light")};
    }
  }

  .dot:after {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: ${({ dotColor }) =>
      dotColor || getTheme("colors.secondary.main")};
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .dot-active:after {
    transform: translate(-50%, -50%) scale(1);
  }

  /* Responsive Adjustments */
  @media only screen and (max-width: 1330px) {
    .right-arrow-class {
      right: 0px;
    }
    .left-arrow-class {
      left: 0px;
    }
  }

  @media only screen and (max-width: ${deviceSize.sm}px) {
    .dot {
      height: 12px;
      width: 12px;
    }

    .arrow-button {
      top: 45%;
      right: 0px;
      left: 0px;
    }
  }
`;

