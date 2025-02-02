import styled from "styled-components";

export const StyledCarouselCard1 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-width: 75%; /* Restrict to 75% of the page width */
  margin-left: 25%; /* Start at 75% of the page width */

  .text-content {
    width: 45%; /* Allocate 45% of the content for text */
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;

    .title {
      font-size: 2.5rem; /* Reduced size */
      margin: 0 0 1rem 0;
      line-height: 1.2;
      color: ${(props) => props.theme.colors.text.primary || "#333"};
    }

    .button-link {
      margin-top: 0.75rem;
      padding: 0.75rem 1.25rem; /* Reduced padding */
      font-size: 1rem; /* Reduced font size */
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        background-color: ${(props) => props.theme.colors.primary.dark || "#0056b3"};
      }
    }
  }

  .image-holder {
    width: 50%; /* Allocate 50% of the content for the image */
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05); /* Zoom effect on hover */
      }
    }
  }

  @media only screen and (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    padding: 1rem 1.5rem;

    .text-content {
      width: 100%; /* Take full width for smaller screens */
      text-align: center;
    }

    .image-holder {
      width: 100%; /* Take full width for smaller screens */
      margin-top: 1.5rem;
    }

    .title {
      font-size: 1.8rem; /* Further reduced size for small screens */
    }
  }

  @media only screen and (max-width: 425px) {
    padding: 0.75rem;

    .text-content {
      width: 100%; /* Full width for very small screens */
      text-align: center;
    }

    .title {
      font-size: 1.5rem; /* Further reduced size */
    }

    .button-link {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
    }

    .image-holder {
      width: 100%;
    }
  }
`;
