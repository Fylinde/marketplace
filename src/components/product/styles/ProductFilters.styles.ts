import styled from "styled-components";

const ProductFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;

    &:focus {
      border-color: #007bff;
    }
  }
`;

export default ProductFiltersContainer;
