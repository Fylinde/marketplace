import styled from "styled-components";

const ProductReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #fefefe;
  border-radius: 8px;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .review-item {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;

    p {
      margin: 0;
      font-size: 1rem;
      color: #333;
    }
  }

  .add-review {
    display: flex;
    flex-direction: column;
    gap: 10px;

    textarea {
      width: 100%;
      height: 100px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    input[type="number"] {
      width: 60px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      background-color: #007bff;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
`;

export default ProductReviewsContainer;
