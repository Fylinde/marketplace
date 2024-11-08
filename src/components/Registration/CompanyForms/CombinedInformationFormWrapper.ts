// CombinedInformationForm.styles.tsx
import styled from "styled-components";

const CombinedInformationFormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .form-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;

    label {
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #555;
    }

    input,
    select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
  }

  .name-group {
    display: flex;
    gap: 10px;

    input {
      flex: 1;
    }
  }

  .form-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;

    .next-button,
    .submit-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    .next-button {
      background-color: #007bff;
      color: #fff;
    }

    .submit-btn {
      background-color: #28a745;
      color: #fff;
    }
  }

  @media only screen and (max-width: 768px) {
    padding: 15px;

    h2 {
      font-size: 1.25rem;
    }

    .form-navigation {
      flex-direction: column;
      gap: 10px;

      .next-button,
      .submit-btn {
        width: 100%;
        padding: 0.75rem;
      }
    }
  }

  @media only screen and (max-width: 425px) {
    padding: 10px;

    .form-group {
      label {
        font-size: 0.9rem;
      }

      input,
      select {
        font-size: 0.9rem;
      }
    }

    .form-navigation {
      flex-direction: column;
      gap: 10px;

      .next-button,
      .submit-btn {
        width: 100%;
        padding: 0.6rem;
      }
    }
  }
`;

export default CombinedInformationFormWrapper;
