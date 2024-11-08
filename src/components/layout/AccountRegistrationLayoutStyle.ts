// src/layouts/AccountRegistrationLayoutStyle.ts
import styled from "styled-components";
import { getTheme } from "../../utils/utils";

const StyledAccountRegistrationLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${getTheme("colors.body.paper")};

  /* Center the content area */
  .registration-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: ${getTheme("colors.background.default")};
  }

  .registration-wrapper {
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    background-color: ${getTheme("colors.body.paper")};
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    h2 {
      text-align: center;
      font-size: 1.5rem;
      color: ${getTheme("colors.text.primary")};
      margin-bottom: 1.5rem;
    }
  }

  footer {
    margin-top: auto;
  }
`;

export default StyledAccountRegistrationLayout;
