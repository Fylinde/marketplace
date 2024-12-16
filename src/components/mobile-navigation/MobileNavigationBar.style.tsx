import styled from "styled-components";
import { layoutConstant } from "utils/constants";
import { getTheme } from "../../utils/utils";

const StyledMobileNavigationBar = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${layoutConstant.mobileNavHeight};
  justify-content: space-around;
  align-items: center;
  background: ${getTheme("colors.body.paper")};
  box-shadow: 0px -1px 8px rgba(0, 0, 0, 0.1); /* Enhanced shadow for a modern look */
  z-index: 1000; /* Ensures it stays on top of other elements */

  /* Dynamic link styling */
  .link {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    color: ${getTheme("colors.text.primary")}; /* Dynamically fetch primary text color */
    position: relative;
    text-decoration: none;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: ${getTheme("colors.primary.main")}; /* Change to primary color on hover */
      transform: translateY(-4px); /* Adds a slight hover animation */
    }

    .icon {
      margin-bottom: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px; /* Standardized icon size */
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.2); /* Icon zoom on hover */
      }
    }

    .cart-badge {
      position: absolute;
      top: -4px;
      right: calc(50% - 8px);
      background-color: ${getTheme("colors.primary.main")}; /* Use primary color for badge */
      color: ${getTheme("colors.body.paper")}; /* Contrast color for badge text */
      font-size: 10px;
      font-weight: bold;
      border-radius: 50%;
      padding: 0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  /* Show navigation bar only on mobile screens */
  @media only screen and (max-width: 900px) {
    display: flex;
    width: 100vw;
  }
`;

export default StyledMobileNavigationBar;
