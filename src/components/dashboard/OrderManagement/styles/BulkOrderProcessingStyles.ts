import styled from "styled-components";

export const BulkOrderContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const PageHeader = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  label {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    color: #555;

    select {
      margin-top: 5px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;

  thead {
    background-color: #f1f1f1;

    th {
      padding: 10px;
      text-align: left;
      font-size: 1rem;
      color: #666;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #ddd;

      &:hover {
        background-color: #f9f9f9;
      }

      td {
        padding: 10px;
        font-size: 1rem;
        color: #555;

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }
      }
    }

    tr:last-child {
      border-bottom: none;
    }
  }
`;

export const BulkActionButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

export const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

export const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #d9534f;
  background-color: #f8d7da;
  padding: 10px;
  border: 1px solid #f5c2c7;
  border-radius: 4px;
`;
