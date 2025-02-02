import styled from "styled-components";
import { getTheme } from "../../utils/utils";
import Box from "../Box";

type StyledProductCategoryProps = {
  onClick: any;
};

const StyledProductCategory = styled(Box)<StyledProductCategoryProps>`
  display: flex;
  flex-direction: column; /* Ensures proper alignment */
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    box-shadow: ${getTheme("shadows.4")};
  }

  img {
    max-width: 80%; /* Adjust to fit the container */
    height: auto; /* Maintain aspect ratio */
    object-fit: cover;
  }

  .product-category-title {
    margin-top: 1rem;
    text-align: center;
    font-weight: bold;
  }
`;


export default StyledProductCategory;
