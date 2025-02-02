import styled from "styled-components";

export const AcknowledgmentContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const TermsContainer = styled.div`
  margin-bottom: 20px;
  text-align: left;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
  }
`;

export const TermsButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
  margin: 20px 0;

  input {
    margin-right: 10px;
  }
`;

export const SubmitButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#ccc" : "#28a745")};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "#218838")};
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p, ul {
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
  }

  ul {
    padding-left: 20px;
    list-style: disc;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  color: #555;

  &:hover {
    color: black;
  }
`;
