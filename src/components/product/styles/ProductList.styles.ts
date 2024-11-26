import styled from "styled-components";

const ProductListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;

    button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        background-color: #0056b3;
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }
`;

export default ProductListContainer;
