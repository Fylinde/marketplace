import styled from "styled-components";
import { space } from "styled-system";
import { getTheme } from "../../utils/utils";

export const StyledPagination = styled.div`
  .pagination {
    margin: 0px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center; /* Center align for better responsiveness */
    list-style-type: none;
    padding: 0px;

    li {
      cursor: pointer;

      a {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        width: 32px;
        margin: 0px 5px;
        border-radius: 50%;
        outline: none;
        border: 1px solid transparent;

        /* Adjust margin and size for smaller screens */
        @media only screen and (max-width: 768px) {
          height: 28px;
          width: 28px;
          margin: 4px;
        }

        @media only screen and (max-width: 450px) {
          height: 24px;
          width: 24px;
          margin: 3px;
        }
      }

      &:not(.active):hover {
        a {
          border: 1px solid ${getTheme("colors.primary.main")};
          color: ${getTheme("colors.primary.main")};
          background-color: ${getTheme("colors.primary.light")};
        }
      }
    }

    .active {
      cursor: default;
      a {
        border: 1px solid ${getTheme("colors.primary.main")};
        color: ${getTheme("colors.primary.main")};
        background-color: ${getTheme("colors.primary.lighter")};
        font-weight: bold; /* Highlight active item */
      }
    }

    .disabled {
      .control-button {
        cursor: not-allowed;
        border: 1px solid ${getTheme("colors.primary.light")};
        color: ${getTheme("colors.primary.light")};
        opacity: 0.5; /* Visual feedback for disabled state */
      }
    }
  }

  .control-button {
    height: 32px;
    width: 32px;
    min-width: 32px;
    border: 1px solid ${getTheme("colors.primary.main")};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: ${getTheme("colors.gray.200")};

    &:hover {
      border-color: ${getTheme("colors.primary.main")};
      background-color: ${getTheme("colors.primary.light")};
    }

    /* Adjust size for smaller screens */
    @media only screen and (max-width: 768px) {
      height: 28px;
      width: 28px;
    }

    @media only screen and (max-width: 450px) {
      height: 24px;
      width: 24px;
    }
  }

  /* First and Last Buttons */
  .first-page-button,
  .last-page-button {
    margin: 0 8px;
    font-size: 14px;
    color: ${getTheme("colors.secondary.main")};
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
      color: ${getTheme("colors.secondary.dark")};
      text-decoration: underline;
    }

    &:disabled {
      color: ${getTheme("colors.gray.400")};
      cursor: not-allowed;
    }

    /* Adjust for smaller screens */
    @media only screen and (max-width: 450px) {
      font-size: 12px;
    }
  }

  /* Space utility from styled-system */
  ${space}

  /* Add additional global responsive styles if needed */
  @media only screen and (max-width: 768px) {
    .pagination {
      gap: 4px; /* Reduce gap between items */
    }
  }

  @media only screen and (max-width: 450px) {
    .pagination {
      flex-direction: column; /* Stack pagination for very small screens */
      gap: 8px;
    }

    li a {
      font-size: 12px; /* Reduce font size for smaller devices */
    }
  }
`;
