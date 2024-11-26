import styled from "styled-components";

const ProductTryOnContainer = styled.div`
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

  img,
  iframe {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

export default ProductTryOnContainer;
