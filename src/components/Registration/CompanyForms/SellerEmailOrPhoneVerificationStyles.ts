import styled from "styled-components";

// Container for the form
export const FormContainer = styled.div`
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// Title of the form
export const FormTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 16px;
    color: #333;
    text-align: center;
`;

// Label for inputs
export const Label = styled.label`
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    text-align: left;
    width: 100%;
`;

// Input field
export const Input = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    text-align: center;
    margin-bottom: 12px;
    &:focus {
        border-color: #007bff;
    }
`;

// Error message
export const ErrorText = styled.p`
    font-size: 14px;
    color: red;
    margin-top: 5px;
`;

// Submit button
export const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 12px;
    &:hover {
        background-color: #0056b3;
    }
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

// Resend OTP button
export const ResendButton = styled.button`
    width: 100%;
    padding: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #007bff;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-top: 10px;
    &:hover {
        text-decoration: underline;
    }
    &:disabled {
        color: #ccc;
        cursor: not-allowed;
    }
`;
