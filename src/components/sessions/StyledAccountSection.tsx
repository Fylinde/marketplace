import styled from "styled-components";
import { getTheme } from "../../utils/utils";

const StyledAccountSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  background-color: ${getTheme("colors.body.paper")};
  color: ${getTheme("colors.text.primary")};
  width: 600px;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: ${getTheme("colors.text.hint")};
    margin-bottom: 1rem;

    .manage-profiles {
      font-size: 14px;
      color: ${getTheme("colors.primary.main")};
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .account-section {
    display: flex;
    gap: 2rem;
  }

  .account-details {
    flex: 1;

    h4 {
      font-size: 16px;
      font-weight: 600;
      color: ${getTheme("colors.text.secondary")};
      margin-bottom: 0.5rem;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.4rem 0;
        font-size: 14px;
        cursor: pointer;
        color: ${getTheme("colors.text.primary")};

        &:hover {
          color: ${getTheme("colors.primary.main")};
        }
      }
    }
  }

  .login-prompt {
    text-align: center;
    margin-bottom: 1rem;

    .login-button {
      background-color: ${getTheme("colors.primary.main")};
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-bottom: 8px;

      &:hover {
        background-color: ${getTheme("colors.primary.dark")};
      }
    }

    .signup-link {
      color: ${getTheme("colors.primary.main")};
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .signout-button {
    font-size: 14px;
    color: ${getTheme("colors.error.main")};
    cursor: pointer;
    text-align: center;
    margin-top: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default StyledAccountSection;
