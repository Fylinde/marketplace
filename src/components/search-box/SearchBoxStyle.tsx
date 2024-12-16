import styled from "styled-components";
import { getTheme } from "../../utils/utils";

const StyledSearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 100%;
  padding: 0.5rem;
  background-color: ${getTheme("colors.background.paper")};
  border-radius: 50px;
  box-shadow: ${getTheme("shadows.small")};

  .search-icon {
    position: absolute;
    color: ${getTheme("colors.text.secondary")};
    left: 1rem;
    z-index: 1;
    font-size: 1.2rem;
  }

  .search-field {
    flex: 1 1 auto;
    padding-left: 3.5rem;
    padding-right: 12rem;
    height: 48px;
    font-size: 1rem;
    border-radius: 300px;
    border: 1px solid ${getTheme("colors.border.main")};
    transition: all 0.3s ease;

    &:focus {
      border-color: ${getTheme("colors.primary.main")};
      box-shadow: 0 0 0 3px ${getTheme("colors.primary.light")};
    }
  }

  .search-button {
    position: absolute;
    height: 100%;
    right: 0;
    border-radius: 0 50px 50px 0;
    padding: 0 2rem;
    background-color: ${getTheme("colors.primary.main")};
    color: ${getTheme("colors.text.white")};
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${getTheme("colors.primary.dark")};
    }
  }

  .category-dropdown {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: ${getTheme("colors.text.secondary")};
    font-size: 0.9rem;
    border-left: 1px solid ${getTheme("colors.border.main")};
    padding: 0.5rem 1rem;
    background-color: ${getTheme("colors.background.paper")};
    border-radius: 0 50px 50px 0;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${getTheme("colors.primary.light")};
    }
  }

  .dropdown-handler {
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.25rem;
    border-left: 1px solid ${getTheme("colors.border.main")};

    span {
      margin-right: 0.5rem;
      font-size: 0.9rem;
      font-weight: bold;
    }
  }

  .advanced-search-toggle {
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    right: 6rem;
    transform: translateY(-50%);
    font-size: 1rem;
    color: ${getTheme("colors.primary.main")};
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }

    @media only screen and (max-width: 768px) {
      right: 4rem;
    }
  }

  .menu-button {
    display: none;
  }

  @media only screen and (max-width: 900px) {
    .category-dropdown {
      display: none;
    }
    .search-icon {
      left: 1rem;
    }
    .search-field {
      height: 42px;
      border-radius: 300px;
      padding-left: 2.75rem;
      padding-right: 3.5rem;
      font-size: 0.9rem;
    }
    .search-button {
      padding: 0 1rem;
      font-size: 0.9rem;
    }
    .menu-button {
      display: block;
    }
  }

  @media only screen and (max-width: 600px) {
    .advanced-search-toggle {
      display: none;
    }
    .search-field {
      padding-right: 2.5rem;
    }
  }
`;

export default StyledSearchBox;
