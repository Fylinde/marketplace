import styled from "styled-components";
import Box from "@/components/Box";

const SellerVerificationFormWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  max-width: 500px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 8px;
    text-align: center;
  }

  p {
    font-size: 1rem;
    color: #666;
    text-align: center;
    margin: 0 0 16px;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .error {
    color: red;
    font-size: 0.875rem;
    text-align: center;
    margin-bottom: 8px;
  }

  label {
    font-size: 0.875rem;
    color: #333;
    margin-bottom: 4px;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-color: #007bff;
    }
  }

  .submit-button {
    padding: 12px;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }

  /* Responsive styling */

  /* Extra Small devices (up to 425px) */
  @media only screen and (max-width: 425px) {
    padding: 8px;
    
    h2 {
      font-size: 1.25rem;
    }

    p {
      font-size: 0.875rem;
    }

    input, .submit-button {
      font-size: 0.875rem;
      padding: 10px;
    }
  }

  /* Small devices (up to 768px) */
  @media only screen and (min-width: 426px) and (max-width: 768px) {
    padding: 12px;

    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }
  }

  /* Medium and Large devices (768px and up) */
  @media only screen and (min-width: 769px) {
    padding: 20px;

    h2 {
      font-size: 1.75rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

export default SellerVerificationFormWrapper;
