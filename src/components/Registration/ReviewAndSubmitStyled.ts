import styled from "styled-components";

export const ReviewContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

export const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
`;

export const SectionContent = styled.div`
  margin-bottom: 20px;

  p {
    font-size: 1rem;
    margin: 5px 0;
    color: #555;
  }
`;

export const DocumentLink = styled.a`
  display: block;
  margin-bottom: 10px;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

export const SubmitButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    background: #218838;
  }
`;
