import styled from "styled-components";

const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    text-align: center;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 20px;
  }

  .product-actions {
    display: flex;
    gap: 20px;
  }
`;

export default ProductDetailContainer;
