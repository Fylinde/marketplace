import styled from "styled-components";

export const StyledFooter = styled.footer`
  background: linear-gradient(180deg, #4A90E2, #007BFF);
  color: #ffffff;
  padding: 2rem 1rem;

  .footer-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);

    .column {
      flex: 1;
      min-width: 200px;

      h4 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 0.5rem;

          a {
            color: #ffffff;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s;

            &:hover {
              color: #ffd700; /* Add a nice hover color */
            }
          }
        }
      }
    }

    .social-icons {
      display: flex;
      gap: 1rem;

      a {
        font-size: 1.5rem;
        color: #ffffff;
        transition: color 0.3s;

        &:hover {
          color: #ffd700;
        }
      }
    }
  }

  .footer-middle {
    text-align: center;
    margin: 2rem 0;

    .newsletter {
      h4 {
        margin-bottom: 1rem;
      }

      form {
        display: flex;
        justify-content: center;
        gap: 1rem;

        input {
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 4px;
          border: none;
          outline: none;
          width: 250px;
          max-width: 100%;
        }

        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          background-color: #ffd700;
          color: #000000;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background-color: #ffcc00;
          }
        }
      }
    }
  }

  .footer-bottom {
    text-align: center;
    margin-top: 2rem;
    font-size: 0.9rem;

    p {
      margin: 0.5rem 0;
    }

    ul {
      list-style: none;
      padding: 0;
      display: flex;
      justify-content: center;
      gap: 1.5rem;

      li {
        a {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.9rem;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .footer-top {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .footer-middle form {
      flex-direction: column;

      input {
        width: 100%;
      }
    }

    .footer-bottom ul {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`;
