import styled from "styled-components";

const StyledFilters = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  padding: 1rem;

  h4 {
    font-size: 16px;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.5rem 0;
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rating-buttons {
    display: flex;
    gap: 0.5rem;
  }

  button {
    min-width: 60px;
    text-align: center;
  }
`;

export default StyledFilters;
