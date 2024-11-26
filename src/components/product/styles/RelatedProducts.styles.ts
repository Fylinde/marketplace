import styled from "styled-components";

const RelatedProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .related-product-list {
    display: flex;
    gap: 20px;
    overflow-x: auto;

    .related-product-item {
      flex: 0 0 200px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      background-color: #fff;

      img {
        width: 100%;
        height: auto;
        border-radius: 4px;
      }

      p {
        font-size: 1rem;
        color: #333;
      }
    }
  }
`;

export default RelatedProductsContainer;
