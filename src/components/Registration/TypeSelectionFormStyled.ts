import styled from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f9f9f9, #e3f2fd);
  min-height: 100vh;
  font-family: "Arial", sans-serif;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    color: #007bff;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.2rem;
    color: #555;
  }
`;

export const SelectionGrid = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Card = styled.div`
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 2rem;
  width: 300px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #777;
    margin-bottom: 1rem;
  }
`;

export const CardIcon = styled.div`
  font-size: 3rem;
  color: #007bff;
  margin-bottom: 1rem;
`;

export const LearnMore = styled.span`
  font-size: 0.9rem;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;
