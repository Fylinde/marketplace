import styled from "styled-components";

export const ShippingFormContainer = styled.div`
  margin: 20px auto;
  padding: 20px;
  max-width: 800px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 15px;

    h3 {
      font-size: 20px;
    }
  }
`;

export const ShippingForm = styled.form`
  .ant-form-item {
    margin-bottom: 16px;

    label {
      font-weight: bold;
      margin-bottom: 8px;
    }

    input,
    select {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    input:focus,
    select:focus {
      border-color: #1890ff;
      box-shadow: 0 0 4px rgba(24, 144, 255, 0.2);
    }
  }
`;

export const ShippingCostSummary = styled.div`
  margin-top: 20px;
  font-size: 16px;

  span {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
`;

export const SaveButton = styled.div`
  text-align: right;
  margin-top: 20px;

  button {
    font-size: 16px;
    padding: 10px 20px;
    background: #1890ff;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;

    &:hover {
      background: #40a9ff;
    }

    &:disabled {
      background: #ddd;
      cursor: not-allowed;
    }
  }
`;

export const ErrorMessage = styled.div`
  margin-bottom: 15px;
  .ant-alert {
    font-size: 14px;
  }
`;

export const LoadingSpinner = styled.div`
  text-align: center;
  margin-top: 20px;

  .ant-spin {
    display: inline-block;
  }
`;
