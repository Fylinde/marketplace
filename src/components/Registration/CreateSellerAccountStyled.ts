import styled from "styled-components";


export const Container = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;


export const Button = styled.button`
  padding: 10px;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#007BFF")};
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const InfoText = styled.p`
  text-align: center;
  font-size: 14px;
`;

export const Link = styled.a`
  color: #007bff;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
export const FormGroup = styled.div`
margin-bottom: 15px;
`;


export const FormContainer = styled.div`
  max-width: 500px;
  margin: auto;
`;

export const StyledForm = styled.form`
  background: #fff;
  padding: 20px;
`;


export const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const SubmitButton = styled.button`
  background: blue;
  color: white;
`;

export const SmallText = styled.small`
  display: block;
  margin-top: 5px;
  color: #666;
`;

export const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

export const StyledLink = styled.a`
  color: blue;
  text-decoration: underline;
`;







