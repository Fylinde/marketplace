import styled from "styled-components";

export const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;

  h4 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }

  canvas {
    max-width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    padding: 10px;
    max-width: 100%;
  }
`;

export const DateRangeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;

  input[type="date"] {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DropdownContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;

  select {
    padding: 10px;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
`;
