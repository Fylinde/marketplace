// src/layouts/UserRegistrationLayoutStyle.ts
import styled from "styled-components";
import { getTheme } from "../../utils/utils";

const StyledUserRegistrationLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${getTheme("colors.body.paper")};

  .registration-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    color: ${getTheme("colors.text.primary")};
    margin-bottom: 1rem;
    text-align: center;
  }

  .form-wrapper {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: ${getTheme("colors.body.paper")};
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  footer {
    margin-top: auto;
  }
`;

export default StyledUserRegistrationLayout;
