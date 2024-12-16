import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
`;

export const Section = styled.div`
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const Subtitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
`;

export const OrderList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const OrderItem = styled.li`
  margin: 10px 0;
  display: flex;
  align-items: center;

  label {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const InsightsContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

export const InsightsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const InsightsItem = styled.li`
  margin-bottom: 10px;
`;

export const AuditTrailContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;
