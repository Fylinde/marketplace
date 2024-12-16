import styled from "styled-components";
import { getTheme } from "utils/utils";

export const StyledCarouselCard1 = styled.div`
  text-align: left;
  margin-left: 280px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  background-color: ${getTheme("colors.background.paper")};
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  .title {
    font-size: 3rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    color: ${getTheme("colors.text.primary")};
    transition: font-size 0.3s ease, color 0.3s ease;
  }

  .text-content {
    max-width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .button-link {
      padding: 1rem 1.5rem;
      font-size: 1.25rem;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        background-color: ${getTheme("colors.primary.dark")};
      }
    }
  }

  .image-holder {
    position: relative;
    max-width: 45%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05); /* Zoom effect */
      }
    }
  }

  &:hover {
    box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.15); /* Subtle hover shadow */
  }

  /* Responsive Styles */
  @media only screen and (max-width: 1200px) {
    margin-left: 0;
    padding: 1.5rem 2rem;

    .title {
      font-size: 2.5rem;
    }

    .text-content {
      max-width: 60%;
    }

    .image-holder {
      max-width: 40%;
    }
  }

  @media only screen and (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.5rem;

    .text-content {
      max-width: 100%;
    }

    .image-holder {
      max-width: 80%;
      margin-top: 1.5rem;
    }

    .title {
      font-size: 2rem;
    }
  }

  @media only screen and (max-width: 425px) {
    padding: 1rem;

    .title {
      font-size: 1.5rem;
    }

    .title + * {
      font-size: 0.875rem;
    }

    .button-link {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }

    .image-holder {
      max-width: 100%;
    }
  }
`;
