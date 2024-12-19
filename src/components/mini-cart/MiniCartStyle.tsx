import styled from "styled-components";

export const StyledMiniCart = styled.div`
  width: 300px;
  max-height: 100vh;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  .free-shipping {
    margin-bottom: 1rem;
  }

  .cart-items {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 1rem;
  }

  .cart-summary {
    margin-top: 1rem;
  }
`;

export const StyledCartItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 1rem;
    border-radius: 4px;
  }

  .item-details {
    flex: 1;

    .quantity-controls {
      display: flex;
      align-items: center;

      .quantity {
        margin: 0 0.5rem;
      }
    }
  }

  svg {
    cursor: pointer;
  }
`;
